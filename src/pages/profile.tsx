import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { profiles } from '@/lib/api';
import { Profile } from '@/types';
import { Loader2 } from 'lucide-react';
import { ProfilePreview } from '@/components/profile/profile-preview';

export function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    home_content: '',
    cv_link: '',
    projects: [{ title: '', description: '', url: '' }],
    teachings: ['']
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profiles.getProfile(user!.id);
        setProfile(data);
        setFormData({
          home_content: data.home_content?.join('\n') || '',
          cv_link: data.cv_link || '',
          projects: data.projects || [{ title: '', description: '', url: '' }],
          teachings: data.teachings || ['']
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        home_content: formData.home_content.split('\n').filter(Boolean),
        user_id: user!.id
      };

      if (profile) {
        await profiles.updateProfile(profile.id, dataToSave);
      } else {
        await profiles.createProfile(dataToSave);
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', url: '' }]
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    const newProjects = [...formData.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setFormData(prev => ({ ...prev, projects: newProjects }));
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
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">About Me</label>
              <Textarea
                value={formData.home_content}
                onChange={e => setFormData(prev => ({ ...prev, home_content: e.target.value }))}
                placeholder="Write something about yourself..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CV Link</label>
              <Input
                value={formData.cv_link}
                onChange={e => setFormData(prev => ({ ...prev, cv_link: e.target.value }))}
                placeholder="Link to your CV"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.projects.map((project, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <Input
                  value={project.title}
                  onChange={e => updateProject(index, 'title', e.target.value)}
                  placeholder="Project Title"
                />
                <Textarea
                  value={project.description}
                  onChange={e => updateProject(index, 'description', e.target.value)}
                  placeholder="Project Description"
                />
                <Input
                  value={project.url}
                  onChange={e => updateProject(index, 'url', e.target.value)}
                  placeholder="Project URL"
                />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addProject}>
              Add Project
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <ProfilePreview data={formData} />
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}