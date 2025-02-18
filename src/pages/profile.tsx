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
import { Loader2, Upload } from 'lucide-react';
import { ProfilePreview } from '@/components/profile/profile-preview';
import { supabase } from '@/utils/supabase-client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    org_role: 'team' as 'advisory' | 'team' | 'fellow',
    home_content: '',
    cv_link: '',
    profile_image: '',
    projects: [{ title: '', description: '', url: '' }],
    teachings: ['']
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profiles.getProfile(user!.id);
        setProfile(data);
        setFormData({
          name: data.name || '',
          org_role: data.org_role || 'team',
          home_content: data.home_content?.join('\n') || '',
          cv_link: data.cv_link || '',
          profile_image: data.profile_image || '',
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
  }, [user, toast]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, profile_image: data.publicUrl }));
      toast({
        title: 'Success',
        description: 'Profile image uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload profile image',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Name is required',
        variant: 'destructive'
      });
      return;
    }

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
              <label className="text-sm font-medium">Profile Image</label>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {formData.profile_image ? (
                    <img
                      src={formData.profile_image || "/placeholder.svg"}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: Square image, at least 256x256 pixels
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role *</label>
              <Select
                value={formData.org_role}
                onValueChange={(value: 'advisory' | 'team' | 'fellow') =>
                  setFormData(prev => ({ ...prev, org_role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="advisory">Advisory</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="fellow">Fellow</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                type="url"
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
                  type="url"
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