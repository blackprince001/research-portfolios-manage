import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PublicationForm } from '@/components/publications/publication-form';
import { useAuth } from '@/lib/auth';
import { publications } from '@/lib/api';
import { Publication } from '@/types';
import { Plus, Loader2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function PublicationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userPublications, setUserPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);

  const fetchPublications = async () => {
    try {
      const data = await publications.getUserPublications(user!.id);
      setUserPublications(data);
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load publications',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []); // Updated useEffect dependency array

  const handleSubmit = async (data: Omit<Publication, 'id' | 'user_id'>) => {
    try {
      if (editingPublication) {
        await publications.updatePublication(editingPublication.id, {
          ...data,
          user_id: user!.id
        });
        toast({
          title: 'Success',
          description: 'Publication updated successfully'
        });
      } else {
        await publications.createPublication({
          ...data,
          user_id: user!.id
        });
        toast({
          title: 'Success',
          description: 'Publication created successfully'
        });
      }
      setDialogOpen(false);
      fetchPublications();
      setEditingPublication(null);
    } catch (error) {
      console.error('Error saving publication:', error);
      toast({
        title: 'Error',
        description: 'Failed to save publication',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      await publications.deletePublication(id);
      toast({
        title: 'Success',
        description: 'Publication deleted successfully'
      });
      fetchPublications();
    } catch (error) {
      console.error('Error deleting publication:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete publication',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (publication: Publication) => {
    setEditingPublication(publication);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Publications</h1>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditingPublication(null);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Publication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPublication ? 'Edit Publication' : 'Add Publication'}
                </DialogTitle>
              </DialogHeader>
              <PublicationForm
                publication={editingPublication}
                onSubmit={handleSubmit}
                onCancel={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {userPublications.map((pub) => (
            <Card key={pub.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{pub.title}</h3>
                    <p className="text-sm text-muted-foreground">{pub.authors}</p>
                    <p className="text-sm text-muted-foreground">{pub.year}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pub)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(pub.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{pub.abstract}</p>
                {pub.publication_type === 'journal' && pub.journal && (
                  <p className="text-sm text-muted-foreground">Journal: {pub.journal}</p>
                )}
                {pub.publication_type === 'conference' && pub.conference && (
                  <p className="text-sm text-muted-foreground">Conference: {pub.conference}</p>
                )}
                <div className="flex space-x-2 mt-4">
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      DOI
                    </a>
                  )}
                  {pub.url && (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Link
                    </a>
                  )}
                  {pub.pdf_link && (
                    <a
                      href={pub.pdf_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      PDF
                    </a>
                  )}
                </div>
              </CardContent>
              {pub.paper_summary && (
                <CardFooter className="border-t pt-4">
                  <div className="w-full">
                    <h4 className="text-sm font-medium mb-2">Audio Summary</h4>
                    <iframe
                      width="100%"
                      height="166"
                      scrolling="no"
                      frameBorder="no"
                      allow="autoplay"
                      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(pub.paper_summary)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                    ></iframe>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}

          {userPublications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No publications added yet.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}