
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StorageIntegrationDashboard } from '@/components/admin/storage/StorageIntegrationDashboard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DownloadCloud,
  File,
  FileAudio,
  FileImage,
  FileVideo,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFileUpload } from '@/hooks/admin/useFileUpload';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminStorage: React.FC = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTab, setSelectedTab] = React.useState('all');
  const { uploadFile, isUploading, progress } = useFileUpload();
  
  // Mock data for demo purposes
  const files = [
    {
      id: 'file1',
      name: 'projeto-maria-v1.mp3',
      type: 'audio',
      size: '3.2 MB',
      uploadedAt: '10/05/2023',
      project: 'Projeto Maria',
    },
    {
      id: 'file2',
      name: 'capa-album-joao.jpg',
      type: 'image',
      size: '1.8 MB',
      uploadedAt: '15/05/2023',
      project: 'Projeto João',
    },
    {
      id: 'file3',
      name: 'contrato-servico.pdf',
      type: 'document',
      size: '0.5 MB',
      uploadedAt: '20/05/2023',
      project: 'Administrativo',
    },
    {
      id: 'file4',
      name: 'tutorial-mixagem.mp4',
      type: 'video',
      size: '24.6 MB',
      uploadedAt: '01/06/2023',
      project: 'Tutoriais',
    },
    {
      id: 'file5',
      name: 'briefing-carlos.docx',
      type: 'document',
      size: '0.3 MB',
      uploadedAt: '05/06/2023',
      project: 'Projeto Carlos',
    },
  ];

  const getIconForFile = (type: string) => {
    switch (type) {
      case 'audio':
        return <FileAudio className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <FileImage className="h-5 w-5 text-green-500" />;
      case 'video':
        return <FileVideo className="h-5 w-5 text-purple-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-amber-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         file.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTab === 'all' || file.type === selectedTab;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        await uploadFile(files[0]);
        setIsUploadDialogOpen(false);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">Armazenamento</h1>
        <p className="text-gray-500 mb-6">
          Gerencie seus arquivos de áudio, vídeo, imagens e documentos
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant={selectedTab === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTab('all')}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={selectedTab === 'audio' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTab('audio')}
                  >
                    Áudios
                  </Button>
                  <Button
                    variant={selectedTab === 'image' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTab('image')}
                  >
                    Imagens
                  </Button>
                  <Button
                    variant={selectedTab === 'document' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTab('document')}
                  >
                    Documentos
                  </Button>
                  <Button
                    variant={selectedTab === 'video' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTab('video')}
                  >
                    Vídeos
                  </Button>
                </div>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar arquivos..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Projeto</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Enviado em</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getIconForFile(file.type)}
                            <span>{file.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{file.project}</TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell>{file.uploadedAt}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <DownloadCloud className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Renomear
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredFiles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                          Nenhum arquivo encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          
          <div>
            <div className="border rounded-md p-4">
              <h2 className="font-semibold mb-4">Armazenamento</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Usado</span>
                    <span>32.4 GB / 100 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '32.4%' }}></div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Por tipo de arquivo</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center">
                          <FileAudio className="h-4 w-4 text-blue-500 mr-1" />
                          Áudio
                        </span>
                        <span>18.2 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '56%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center">
                          <FileVideo className="h-4 w-4 text-purple-500 mr-1" />
                          Vídeo
                        </span>
                        <span>8.5 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '26%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center">
                          <FileImage className="h-4 w-4 text-green-500 mr-1" />
                          Imagem
                        </span>
                        <span>4.8 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 text-amber-500 mr-1" />
                          Documento
                        </span>
                        <span>0.9 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '3%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    Gerenciar plano
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 mt-4">
              <h2 className="font-semibold mb-3">Integrações</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-2">
                      <img src="https://cdn.cdnlogo.com/logos/g/43/google-drive.svg" alt="Google Drive" className="w-5 h-5" />
                    </div>
                    <span>Google Drive</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Conectado</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-2">
                      <img src="https://cdn.cdnlogo.com/logos/d/41/dropbox.svg" alt="Dropbox" className="w-5 h-5" />
                    </div>
                    <span>Dropbox</span>
                  </div>
                  <Button variant="outline" size="sm">Conectar</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-2">
                      <img src="https://cdn.cdnlogo.com/logos/o/96/onedrive.svg" alt="OneDrive" className="w-5 h-5" />
                    </div>
                    <span>OneDrive</span>
                  </div>
                  <Button variant="outline" size="sm">Conectar</Button>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t">
                <Button variant="ghost" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar integração
                </Button>
              </div>
            </div>
            
            <StorageIntegrationDashboard />
          </div>
        </div>
      </div>
      
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload de Arquivo</DialogTitle>
            <DialogDescription>
              Faça upload de arquivos para o armazenamento. Formatos suportados: MP3, WAV, PDF, DOCX, JPG, PNG, MP4.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed rounded-md p-8 text-center">
              <UploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="mb-2 text-sm">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-xs text-gray-500">
                Tamanho máximo: 100MB
              </p>
              
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="mt-4">
                  Selecionar arquivo
                </Button>
              </label>
              
              {isUploading && (
                <div className="mt-4">
                  <div className="text-sm mb-1">Enviando...</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminStorage;
