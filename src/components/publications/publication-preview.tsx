import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Card, CardContent } from "@/components/ui/card";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { Eye } from "lucide-react";
  
  interface PreviewData {
    title: string;
    abstract: string;
    authors: string;
    publication_type: string;
    journal?: string;
    conference?: string;
    year: number;
    doi?: string;
    url?: string;
    pdf_link?: string;
  }
  
  interface PublicationPreviewProps {
    data: PreviewData;
  }
  
  function formatAuthors(authors: string): string {
    return authors
      .split(',')
      .map(author => author.trim())
      .join(', ');
  }
  
  function formatCitation(data: PreviewData): string {
    const authors = formatAuthors(data.authors);
    const year = data.year;
    const title = data.title;
    
    let citation = `${authors} (${year}). ${title}.`;
  
    if (data.publication_type === 'journal' && data.journal) {
      citation += ` ${data.journal}`;
    } else if (data.publication_type === 'conference' && data.conference) {
      citation += ` In: ${data.conference}`;
    }
  
    if (data.doi) {
      citation += `. DOI: ${data.doi}`;
    }
  
    return citation;
  }
  
  export function PublicationPreview({ data }: PublicationPreviewProps) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Publication Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Citation */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-semibold mb-2">Citation:</h3>
                  <p className="text-sm">{formatCitation(data)}</p>
                </CardContent>
              </Card>
  
              {/* Main Content */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{data.title}</h1>
                  <p className="text-muted-foreground mt-1">{formatAuthors(data.authors)}</p>
                </div>
  
                {/* Type and Year */}
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {data.publication_type.charAt(0).toUpperCase() + data.publication_type.slice(1)}
                  </Badge>
                  <Badge variant="outline">{data.year}</Badge>
                </div>
  
                {/* Abstract */}
                <div>
                  <h3 className="font-semibold mb-2">Abstract</h3>
                  <p className="text-sm">{data.abstract}</p>
                </div>
  
                {/* Publication Details */}
                <div className="grid grid-cols-2 gap-4">
                  {data.journal && (
                    <div>
                      <h3 className="text-sm font-semibold">Journal</h3>
                      <p className="text-sm">{data.journal}</p>
                    </div>
                  )}
                  {data.conference && (
                    <div>
                      <h3 className="text-sm font-semibold">Conference</h3>
                      <p className="text-sm">{data.conference}</p>
                    </div>
                  )}
                </div>
  
                {/* Links */}
                <div className="flex flex-wrap gap-2">
                  {data.doi && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={`https://doi.org/${data.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        DOI
                      </a>
                    </Button>
                  )}
                  {data.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Website
                      </a>
                    </Button>
                  )}
                  {data.pdf_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={data.pdf_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        PDF
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }