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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { organization } from '@/lib/api';
import {
    OrganizationCenter,
    OrganizationPartner,
    OrganizationCareer,
} from '@/types';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { CenterForm } from '@/components/organization/center-form';
import { PartnerForm } from '@/components/organization/partner-form';
import { CareerForm } from '@/components/organization/career-form';
import { Badge } from '@/components/ui/badge';

export function OrganizationPage() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('centers');
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [centers, setCenters] = useState<OrganizationCenter[]>([]);
    const [partners, setPartners] = useState<OrganizationPartner[]>([]);
    const [careers, setCareers] = useState<OrganizationCareer[]>([]);


    const [editingItem, setEditingItem] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [centersData, partnersData, careersData] = await Promise.all([
                organization.getCenters(),
                organization.getPartners(),
                organization.getCareers(),
            ]);

            setCenters(centersData);
            setPartners(partnersData);
            setCareers(careersData);

        } catch (error) {
            console.error('Error fetching organization data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load organization data',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (type: string, id: number) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            switch (type) {
                case 'centers':
                    await organization.deleteCenter(id);
                    break;
                case 'partners':
                    await organization.deletePartner(id);
                    break;
                case 'careers':
                    await organization.deleteCareer(id);
                    break;
            }

            toast({
                title: 'Success',
                description: 'Item deleted successfully'
            });
            fetchData();
        } catch (error) {
            console.error('Error deleting item:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete item',
                variant: 'destructive'
            });
        }
    };

    const handleSubmit = async (type: string, data: any) => {
        try {
            if (editingItem) {
                switch (type) {
                    case 'centers':
                        await organization.updateCenter(editingItem.id, data);
                        break;
                    case 'partners':
                        await organization.updatePartner(editingItem.id, data);
                        break;
                    case 'careers':
                        await organization.updateCareer(editingItem.id, data);
                        break;
                }
            } else {
                switch (type) {
                    case 'centers':
                        await organization.createCenter(data);
                        break;
                    case 'partners':
                        await organization.createPartner(data);
                        break;
                    case 'careers':
                        await organization.createCareer(data);
                        break;
                }
            }

            toast({
                title: 'Success',
                description: `Item ${editingItem ? 'updated' : 'created'} successfully`
            });
            setDialogOpen(false);
            setEditingItem(null);
            fetchData();
        } catch (error) {
            console.error('Error saving item:', error);
            toast({
                title: 'Error',
                description: 'Failed to save item',
                variant: 'destructive'
            });
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
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Organization</h1>
                    <Dialog
                        open={dialogOpen}
                        onOpenChange={(open) => {
                            setDialogOpen(open);
                            if (!open) setEditingItem(null);
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add {activeTab.slice(0, -1)}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Add ${activeTab.slice(0, -1)}`}
                                </DialogTitle>
                            </DialogHeader>
                            {activeTab === 'centers' && (
                                <CenterForm
                                    center={editingItem}
                                    onSubmit={(data) => handleSubmit('centers', data)}
                                    onCancel={() => setDialogOpen(false)}
                                />
                            )}
                            {activeTab === 'partners' && (
                                <PartnerForm
                                    partner={editingItem}
                                    onSubmit={(data) => handleSubmit('partners', data)}
                                    onCancel={() => setDialogOpen(false)}
                                />
                            )}
                            {activeTab === 'careers' && (
                                <CareerForm
                                    career={editingItem}
                                    onSubmit={(data) => handleSubmit('careers', data)}
                                    onCancel={() => setDialogOpen(false)}
                                />
                            )}
                        </DialogContent>
                    </Dialog>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="centers">Centers</TabsTrigger>
                        <TabsTrigger value="partners">Partners</TabsTrigger>
                        <TabsTrigger value="careers">Careers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="centers" className="space-y-4">
                        {centers.map((center) => (
                            <Card key={center.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{center.center_name}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{center.location}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingItem(center);
                                                    setDialogOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete('centers', center.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </TabsContent>

                    <TabsContent value="partners" className="space-y-4">
                        {partners.map((partner) => (
                            <Card key={partner.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-4">
                                            {partner.logo_url && (
                                                <img
                                                    src={partner.logo_url || "/placeholder.svg"}
                                                    alt={partner.name}
                                                    className="h-12 w-12 object-contain"
                                                />
                                            )}
                                            <div>
                                                <CardTitle>{partner.name}</CardTitle>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {partner.socials.map((social, index) => (
                                                        <a
                                                            key={index}
                                                            href={social}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:underline"
                                                        >
                                                            Social {index + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingItem(partner);
                                                    setDialogOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete('partners', partner.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </TabsContent>

                    <TabsContent value="careers" className="space-y-4">
                        {careers.map((career) => (
                            <Card key={career.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <CardTitle>{career.title}</CardTitle>
                                                <Badge variant={career.is_closed ? "secondary" : "default"}>
                                                    {career.is_closed ? "Closed" : "Open"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{career.type}</p>
                                            <p className="mt-2">{career.description}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingItem(career);
                                                    setDialogOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete('careers', career.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}