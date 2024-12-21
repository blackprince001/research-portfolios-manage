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
import { Plus, Loader2 } from 'lucide-react';

export function PublicationsPage() {
  const { user } = useAuth();
  const [userPublications, setUserPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchPublications = async () => {
    try {
      const data = await publications.getUserPublications(user!.id);
      setUserPublications(data);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [user]);

  const handleCreatePublication = async (data: Omit<Publication, 'id' | 'user_id'>) => {
    try {
      await publications.createPublication({
        ...data,
        user_id: user!.id,
      });
      setDialogOpen(false);
      fetchPublications();
    } catch (error) {
      console.error('Error creating publication:', error);
      throw error;
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Publications</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Publication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Publication</DialogTitle>
            </DialogHeader>
            <PublicationForm
              onSubmit={handleCreatePublication}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {userPublications.map((pub) => (
          <div
            key={pub.id}
            className="p-4 rounded-lg border bg-card text-card-foreground"
          >
            <h3 className="text-lg font-semibold">{pub.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {pub.authors} • {pub.year}
            </p>
            <p className="mt-2">{pub.abstract}</p>
            {(pub.doi || pub.url) && (
              <div className="mt-2 space-x-2">
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
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}