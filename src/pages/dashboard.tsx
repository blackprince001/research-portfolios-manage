import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { publications, teaching, profiles } from '@/lib/api';
import { Loader2, BookOpen, GraduationCap, User, Link as LinkIcon } from 'lucide-react';
import { Publication, TeachingExperience, Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [publication, setPublications] = useState<Publication[]>([]);
  const [teachingExp, setTeachingExp] = useState<TeachingExperience[]>([]);

  const [publicationStats, setPublicationStats] = useState({
    totalPublications: 0,
    byType: [] as { type: string; count: number }[],
    byYear: [] as { year: number; count: number }[]
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [profileData, pubData, teachData] = await Promise.all([
          profiles.getProfile(user!.id),
          publications.getUserPublications(user!.id),
          teaching.getUserTeaching(user!.id)
        ]);

        setProfile(profileData);
        setPublications(pubData);
        setTeachingExp(teachData);

        // Calculate publication statistics
        const typeCount = pubData.reduce((acc, pub) => {
          acc[pub.publication_type] = (acc[pub.publication_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const yearCount = pubData.reduce((acc, pub) => {
          acc[pub.year] = (acc[pub.year] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        setPublicationStats({
          totalPublications: pubData.length,
          byType: Object.entries(typeCount).map(([type, count]) => ({ 
            type: type.charAt(0).toUpperCase() + type.slice(1), 
            count 
          })),
          byYear: Object.entries(yearCount)
            .map(([year, count]) => ({ 
              year: parseInt(year), 
              count 
            }))
            .sort((a, b) => a.year - b.year)
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Publications
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publicationStats.totalPublications}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Teaching Experience
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teachingExp.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Taught</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teachingExp.reduce((total, exp) => total + exp.courses.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Profile Overview</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.home_content?.[0]?.slice(0, 200)}
                    {(profile.home_content?.[0]?.length || 0) > 200 ? '...' : ''}
                  </p>
                </div>
                {profile.cv_link && (
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    <a
                      href={profile.cv_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View CV
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No profile information added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Publications */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Publications</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/publication')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {publication.length > 0 ? (
              <div className="space-y-4">
                {publication.slice(0, 3).map((pub) => (
                  <div key={pub.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <h3 className="font-medium">{pub.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{pub.authors}</p>
                    <p className="text-sm text-muted-foreground">{pub.year}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No publication added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Publications Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Publications by Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={publicationStats.byYear}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Teaching Experience */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Teaching Experience</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/teaching')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {teachingExp.length > 0 ? (
              <div className="space-y-4">
                {teachingExp.slice(0, 3).map((exp) => (
                  <div key={exp.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <h3 className="font-medium">{exp.position}</h3>
                    <p className="text-sm text-muted-foreground">{exp.institution}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exp.start_date).toLocaleDateString()} - 
                      {exp.end_date 
                        ? new Date(exp.end_date).toLocaleDateString()
                        : 'Present'}
                    </p>
                    {exp.courses.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Courses:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {exp.courses.slice(0, 2).map((course) => (
                            <li key={course.id}>{course.name}</li>
                          ))}
                          {exp.courses.length > 2 && (
                            <li>+{exp.courses.length - 2} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No teaching experience added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}