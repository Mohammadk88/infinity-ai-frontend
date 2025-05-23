'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { AIProvider } from '@/types/AIProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

type ProvidersListProps = {
  providers: AIProvider[];
  onEdit: (provider: AIProvider) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
};

export default function ProvidersList({ providers, onEdit, onDelete, onToggleActive }: ProvidersListProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const { toast } = useToast();

  const confirmDelete = (id: string) => {
    setProviderToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!providerToDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(providerToDelete);
      toast({
        title: 'Provider deleted',
        description: 'The AI provider has been deleted successfully.',
      });
    } catch (_) {
      toast({
        title: 'Error',
        description: 'Failed to delete provider. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setProviderToDelete(null);
    }
  };

  const handleToggleActive = async (id: string, currentValue: boolean) => {
    setIsToggling(id);
    try {
      await onToggleActive(id, !currentValue);
      toast({
        title: 'Status updated',
        description: `Provider is now ${!currentValue ? 'active' : 'inactive'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update provider status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsToggling(null);
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No AI providers added yet
                </TableCell>
              </TableRow>
            ) : (
              providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium capitalize">
                    {provider.provider}
                  </TableCell>
                  <TableCell>{provider.model}</TableCell>
                  <TableCell>
                    <Badge variant={provider.isActive ? "success" : "secondary"}>
                      {provider.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(provider.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleToggleActive(provider.id, provider.isActive)}
                      disabled={isToggling === provider.id}
                    >
                      {provider.isActive ? 
                        <ToggleRight className="h-4 w-4 text-green-500" /> : 
                        <ToggleLeft className="h-4 w-4" />
                      }
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(provider)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => confirmDelete(provider.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete AI Provider</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this AI provider? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
