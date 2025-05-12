'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { 
  UserPlus, 
  Mail, 
  Check, 
  User, 
  Loader2,
  AlertCircle,
  SendIcon
} from 'lucide-react';
import { useDebounce } from 'use-debounce';
import api from '@/app/lib/axios';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useUserStore } from '@/store/useUserStore';

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CompanyRole } from '@/types/CompanyMember';

// Form schema with zod validation
const addMemberFormSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  roleId: z.string().min(1, 'الرجاء اختيار دور')
});

type FormValues = z.infer<typeof addMemberFormSchema>;

// User search result interface
interface UserSearchResult {
  id: string;
  name: string;
  email: string;
}

export default function AddCompanyMemberForm({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { currentCompany } = useCompanyStore();
  const { user: currentUser } = useUserStore();

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<CompanyRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [mode, setMode] = useState<'invite' | 'existing'>('invite');
  const [email, setEmail] = useState('');
  const [debouncedEmail] = useDebounce(email, 500);
  const [isExistingMember, setIsExistingMember] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Form setup with React Hook Form + Zod
  const form = useForm<FormValues>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      email: '',
      roleId: '',
    }
  });
  
  // Fetch available roles for the company
  useEffect(() => {
    const fetchRoles = async () => {
      if (!currentCompany?.id) return;
      
      setRolesLoading(true);
      try {
        const response = await api.get(`/roles?companyId=${currentCompany.id}`);
        console.log('Fetched roles:', response.data);
        setRoles(response.data || []);
      } catch (error) {
        console.error("خطأ في جلب الأدوار:", error);
        toast({
          title: t('errors.failed', 'فشل جلب الأدوار'),
          description: t('errors.tryAgain', 'يرجى المحاولة مرة أخرى لاحقاً'),
          variant: 'destructive',
        });
        setRoles([]);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, [currentCompany?.id, t, toast]);

  // Search for users when email input changes (with debounce)
  useEffect(() => {
    const searchUsers = async () => {
      if (!debouncedEmail || debouncedEmail.length < 5) {
        setUserSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const response = await api.get(`/users/search?email=${debouncedEmail}`);
        setUserSearchResults(response.data || []);
        
        // Check if user exists
        if (response.data && response.data.length > 0) {
          // User exists in the system
          setMode('existing');
        } else {
          // User doesn't exist, will be invited
          setMode('invite');
        }
      } catch (error) {
        console.error("خطأ في البحث عن المستخدمين:", error);
        setUserSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    if (debouncedEmail) {
      searchUsers();
    }
  }, [debouncedEmail]);
  
  // Handle email input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    form.setValue('email', e.target.value);
    // Reset selected user and existing member check when email changes
    setSelectedUser(null);
    setIsExistingMember(false);
  };
  
  // Handle selecting a user from search results
  const selectUser = (user: UserSearchResult) => {
    setSelectedUser(user);
    setEmail(user.email);
    form.setValue('email', user.email);
    setUserSearchResults([]);
    
    // Check if user is already a member
    if (currentCompany?.id) {
      checkIfExistingMember(user.id, currentCompany.id);
    }
  };
  
  // Check if user is already a member of the company
  const checkIfExistingMember = async (userId: string, companyId: string) => {
    try {
      const response = await api.get(`/company-members/check?userId=${userId}&companyId=${companyId}`);
      setIsExistingMember(response.data.isMember);
    } catch (error) {
      console.error("خطأ في التحقق من عضوية المستخدم:", error);
      setIsExistingMember(false);
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!currentCompany?.id) {
      toast({
        title: t('errors.missingCompany', 'خطأ'),
        description: t('errors.nocurrentCompany', 'لا توجد شركة نشطة محددة'),
        variant: 'destructive',
      });
      return;
    }
    
    // Don't proceed if user is already a member
    if (isExistingMember) {
      toast({
        title: t('company.members.alreadyMember', 'المستخدم عضو بالفعل'),
        description: t('company.members.alreadyMemberDesc', 'هذا المستخدم عضو بالفعل في الشركة'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'existing' && selectedUser) {
        // Add existing user as member
        await api.post('/company-members', {
          userId: selectedUser.id,
          companyId: currentCompany.id,
          roleId: values.roleId
        });
        
        toast({
          title: t('company.members.addSuccess', 'تمت إضافة العضو بنجاح'),
          description: `${selectedUser.name} تمت إضافته إلى الشركة`,
          variant: 'default',
        });
      } else {
        // Send invitation to new user
        await api.post('/invitations', {
          email: values.email,
          companyId: currentCompany.id,
          roleId: values.roleId,
          invitedBy: currentUser?.id
        });
        
        toast({
          title: t('company.invitations.sent', 'تم إرسال الدعوة'),
          description: `تم إرسال دعوة إلى ${values.email} - تنتهي صلاحيتها خلال 72 ساعة`,
          variant: 'default',
        });
      }
      
      // Reset form after successful submission
      form.reset();
      setEmail('');
      setSelectedUser(null);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast({
        title: t('errors.failed', 'فشلت العملية'),
        description: apiError.response?.data?.message || t('errors.unknownError', 'حدث خطأ غير معروف'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setUserSearchResults([]);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field with User Search */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.email', 'البريد الإلكتروني')}</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="example@company.com"
                            value={email}
                            onChange={handleEmailChange}
                            className="pl-10"
                          />
                        </FormControl>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        {isSearching && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          </div>
                        )}
                        {selectedUser && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <Check className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                      </div>
                      <FormMessage />
                      
                      {/* User search results dropdown */}
                      {userSearchResults.length > 0 && (
                        <div 
                          ref={resultsRef}
                          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                        >
                          <ul className="py-1">
                            {userSearchResults.map((user) => (
                              <li 
                                key={user.id} 
                                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => selectUser(user)}
                              >
                                <User className="h-4 w-4 mr-2 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">{user.name}</p>
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Show if user is already a member */}
                      {isExistingMember && (
                        <div className="mt-2 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {t('company.members.alreadyMember', 'هذا المستخدم عضو بالفعل في الشركة')}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Role Select */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('company.members.role', 'الدور')}</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={rolesLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            {rolesLoading ? (
                              <div className="flex items-center">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {t('common.loading', 'جاري التحميل...')}
                              </div>
                            ) : (
                              <SelectValue placeholder={t('company.members.selectRole', 'اختر دوراً')} />
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.length === 0 && !rolesLoading ? (
                            <div className="p-2 text-sm text-gray-500 text-center">
                              {t('company.roles.noRolesFound', 'لا توجد أدوار')}
                            </div>
                          ) : (
                            roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                <div>
                                  <div>{role.name}</div>
                                  {role.description && (
                                    <div className="text-xs text-gray-500">{role.description}</div>
                                  )}
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* User mode indicator (existing or invite) */}
              {debouncedEmail && debouncedEmail.length >= 5 && !isSearching && (
                <div className="flex items-center mt-2 text-sm">
                  {mode === 'existing' ? (
                    <>
                      <Check className="h-4 w-4 mr-1 text-green-500" />
                      <span className="text-green-600">
                        {t('company.members.userExists', 'المستخدم موجود في النظام')}
                      </span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1 text-blue-500" />
                      <span className="text-blue-600">
                        {t('company.members.willBeInvited', 'سيتم إرسال دعوة لهذا المستخدم')}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting || isExistingMember || form.formState.isSubmitting || roles.length === 0}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : mode === 'existing' ? (
                <UserPlus className="h-4 w-4 mr-2" />
              ) : (
                <SendIcon className="h-4 w-4 mr-2" />
              )}
              
              {mode === 'existing' 
                ? t('company.members.addMember', 'إضافة عضو') 
                : t('company.invitations.sendInvitation', 'إرسال دعوة')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}