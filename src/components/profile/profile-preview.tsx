import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { Eye, Link as LinkIcon } from "lucide-react";
  
  interface Project {
    title: string;
    description: string;
    url: string;
  }
  
  interface PreviewData {
    home_content: string;
    cv_link: string;
    projects: Project[];
  }
  
  interface ProfilePreviewProps {
    data: PreviewData;
  }
  
  export function ProfilePreview({ data }: ProfilePreviewProps) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Profile Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.home_content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-sm">
                      {paragraph}
                    </p>
                  ))}
                  {data.cv_link && (
                    <div className="flex items-center mt-4">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      <a
                        href={data.cv_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View CV
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
  
              {/* Projects Section */}
              {data.projects.length > 0 && data.projects.some(p => p.title || p.description || p.url) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {data.projects.map((project, index) => (
                      project.title || project.description || project.url ? (
                        <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                          <h3 className="font-semibold mb-2">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {project.description}
                          </p>
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline inline-flex items-center"
                            >
                              <LinkIcon className="h-4 w-4 mr-1" />
                              View Project
                            </a>
                          )}
                        </div>
                      ) : null
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }