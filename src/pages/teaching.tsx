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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { teaching } from '@/lib/api';
import { TeachingExperience, Course } from '@/types';
import { Plus, Loader2, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export function TeachingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<TeachingExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<TeachingExperience | null>(null);
  const [formData, setFormData] = useState({
    institution: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    courses: [{ name: '', description: '' }]
  });

  const fetchExperiences = async () => {
    try {
      const data = await teaching.getUserTeaching(user!.id);
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching teaching experiences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load teaching experiences',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [user]);

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        user_id: user!.id
      };

      if (editingExperience) {
        await teaching.updateTeaching(editingExperience.id, data);
      } else {
        await teaching.createTeaching(data);
      }

      setDialogOpen(false);
      fetchExperiences();
      resetForm();
      toast({
        title: 'Success',
        description: 'Teaching experience saved successfully'
      });
    } catch (error) {
      console.error('Error saving teaching experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to save teaching experience',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teaching experience?')) return;
    
    try {
      await teaching.deleteTeaching(id);
      fetchExperiences();
      toast({
        title: 'Success',
        description: 'Teaching experience deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting teaching experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete teaching experience',
        variant: 'destructive'
      });
    }
  };

  const addCourse = () => {
    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, { name: '', description: '' }]
    }));
  };

  const updateCourse = (index: number, field: string, value: string) => {
    const newCourses = [...formData.courses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    setFormData(prev => ({ ...prev, courses: newCourses }));
  };

  const resetForm = () => {
    setFormData({
      institution: '',
      position: '',
      description: '',
      start_date: '',
      end_date: '',
      courses: [{ name: '', description: '' }]
    });
    setEditingExperience(null);
  };

  const handleEdit = (experience: TeachingExperience) => {
    setEditingExperience(experience);
    setFormData({
      institution: experience.institution,
      position: experience.position,
      description: experience.description,
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      courses: experience.courses.length > 0 ? experience.courses.map(course => ({
        name: course.name,
        description: course.description || ''
      })) : [{ name: '', description: '' }]
    });
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
          <h1 className="text-2xl font-bold">Teaching Experience</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingExperience ? 'Edit Teaching Experience' : 'Add Teaching Experience'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Institution</label>
                    <Input
                      value={formData.institution}
                      onChange={e => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                      placeholder="Institution name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Position</label>
                    <Input
                      value={formData.position}
                      onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Position title"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your role"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Courses</label>
                    <Button type="button" variant="outline" size="sm" onClick={addCourse}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Course
                    </Button>
                  </div>
                  {formData.courses.map((course, index) => (
                    <div key={index} className="space-y-2 p-4 border rounded-lg">
                      <Input
                        value={course.name}
                        onChange={e => updateCourse(index, 'name', e.target.value)}
                        placeholder="Course name"
                      />
                      <Textarea
                        value={course.description}
                        onChange={e => updateCourse(index, 'description', e.target.value)}
                        placeholder="Course description"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingExperience ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {experiences.map((experience) => (
            <Card key={experience.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{experience.position}</h3>
                    <p className="text-sm text-muted-foreground">{experience.institution}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(experience.start_date).toLocaleDateString()} - 
                      {experience.end_date 
                        ? new Date(experience.end_date).toLocaleDateString()
                        : 'Present'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(experience)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(experience.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{experience.description}</p>
                {experience.courses && experience.courses.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Courses:</h4>
                    <ul className="space-y-2">
                      {experience.courses.map((course) => (
                        <li key={course.id} className="ml-4">
                          <span className="font-medium">{course.name}</span>
                          {course.description && (
                            <p className="text-sm text-muted-foreground">{course.description}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {experiences.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No teaching experiences added yet.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}