
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StorageIntegrationDashboard from '@/components/admin/storage/StorageIntegrationDashboard';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Trash, 
  Music, 
  FileText, 
  Image, 
  Film,
  File, 
  MoreHorizontal, 
  HardDrive, 
  BarChart, 
  Calendar 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/admin/useFileUpload';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { googleDriveService, STORAGE_FOLDERS } from '@/services/googleDriveService';

// Mock files for demonstration
const mockFiles = [
  {
    id: 'file1',
    name: 'Versão Final - Aniversário João.mp3',
    type: 'audio',
    size: 4.5, // MB
    uploadDate: '15/06/2023',
    projectId: 'P045',
    lastAccessed: '20/06/2023',
    driveUrl: `https://drive.google.com/file/d/${STORAGE_FOLDERS.DOWNLOADS_BASE}/view`
  },
  {
    id: 'file2',
    name: 'Brief - Casamento Silva.pdf',
    type: 'document',
    size: 1.2,
    uploadDate: '12/06/2023',
    projectId: 'P044',
    lastAccessed: '14/06/2023',
    driveUrl: `https://drive.google.com/file/d/${STORAGE_FOLDERS.PROJECTS_BASE}/view`
  },
  {
    id: 'file3',
    name: 'Imagem de Capa - Jingle ModaStyle.jpg',
    type: 'image',
    size: 2.8,
    uploadDate: '18/06/2023',
    projectId: 'P046',
    lastAccessed: '19/06/2023',
    driveUrl: `https://drive.google.com/file/d/${STORAGE_FOLDERS.MARKETING_ASSETS}/view`
  },
  {
    id: 'file4',
    name: 'Vídeo Explicativo - Empresa TechSolutions.mp4',
    type: 'video',
    size: 15.7,
    uploadDate: '10/06/2023',
    projectId: 'P043',
    lastAccessed: '16/06/2023',
    driveUrl: `https://drive.google.com/file/d/${STORAGE_FOLDERS.PROJECTS_BASE}/view`
  },
  {
    id: 'file5',
    name: 'Versão 2 - Podcast Carlos.mp3',
    type: 'audio',
    size: 6.2,
    uploadDate: '21/06/2023',
    projectId: 'P047',
    lastAccessed: '21/06/2023',
    driveUrl: `https://drive.google.com/file/d/${STORAGE_FOLDERS.PREVIEWS_BASE}/view`
  }
];

const AdminStorage: React.FC = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [storageUsed, setStorageUsed] = useState(29.4); // GB
  const [storageTotal, setStorageTotal] = useState(100); // GB
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileType, setUploadFileType] = useState('audio');
  const [uploadProjectId, setUploadProjectId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setFiles(mockFiles);
      setLoading(false);
    }, 800);
  }, []);
  
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         file.projectId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesType;
  });
  
  const getFileIcon = (fileType: string) => {
    switch(fileType) {
      case 'audio':
        return <Music className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-yellow-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-green-500" />;
      case 'video':
        return <Film className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const totalFileSize = files.reduce((acc, file) => acc + file.size, 0);
  
  const handleUploadButtonClick = () => {
    setIsUploadDialogOpen(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadFileName(file.name);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !uploadFileName || !uploadFileType || !uploadProjectId) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setIsUploadDialogOpen(false);
    
    toast({
      title: "Upload iniciado",
      description: `Enviando ${uploadFileName} para o Google Drive...`
    });
    
    // Determine which Google Drive folder to use based on file type
    let folderId = STORAGE_FOLDERS.PROJECTS_BASE;
    if (uploadFileType === 'audio' || uploadFileType === 'preview') {
      folderId = STORAGE_FOLDERS.PREVIEWS_BASE;
    } else if (uploadFileType === 'portfolio') {
      folderId = STORAGE_FOLDERS.MARKETING_ASSETS;
    } else if (uploadFileType === 'invoice') {
      folderId = STORAGE_FOLDERS.INVOICES;
    } else if (uploadFileType === 'final_version') {
      folderId = STORAGE_FOLDERS.DOWNLOADS_BASE;
    }
    
    try {
      // Simulate upload to Google Drive
      setTimeout(() => {
        const fileId = `file_${Date.now()}_${uploadFileName.replace(/\s+/g, '_')}`;
        const fileUrl = googleDriveService.getFileViewUrl(fileId);
        
        const newFile = {
          id: fileId,
          name: uploadFileName,
          type: uploadFileType,
          size: selectedFile.size / (1024 * 1024), // Convert to MB
          uploadDate: new Date().toLocaleDateString('pt-BR'),
          projectId: uploadProjectId,
          lastAccessed: new Date().toLocaleDateString('pt-BR'),
          driveUrl: fileUrl
        };
        
        setFiles([...files, newFile]);
        setIsUploading(false);
        
        toast({
          title: "Upload concluído",
          description: `${uploadFileName} foi enviado com sucesso e vinculado ao projeto ${uploadProjectId}.`
        });
        
        // Reset form
        setSelectedFile(null);
        setUploadFileName('');
        setUploadFileType('audio');
        setUploadProjectId('');
      }, 2000);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao fazer upload do arquivo. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteFile = (fileId: string) => {
    toast({
      title: "Arquivo excluído",
      description: "O arquivo foi removido com sucesso do sistema."
    });
    setFiles(files.filter(file => file.id !== fileId));
  };
  
  const handleOpenInDrive = (driveUrl: string) => {
    window.open(driveUrl, '_blank');
  };
  
  const handleDownloadFile = (fileId: string) => {
    const downloadUrl = googleDriveService.getFileDownloadUrl(fileId);
    window.open(downloadUrl, '_blank');
    
    toast({
      title: "Download iniciado",
      description: "O arquivo está sendo baixado."
    });
  };
  
  // Calculate storage used percentage
  const storageUsedPercent = (storageUsed / storageTotal) * 100;
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Armazenamento</h1>
          <div className="flex gap-2">
            <Button 
              onClick={handleUploadButtonClick} 
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Enviar Arquivos para Google Drive
                </>
              )}
            </Button>
          </div>
        </div>
        
        <StorageIntegrationDashboard />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Armazenamento Utilizado</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageUsed.toFixed(1)} GB de {storageTotal} GB</div>
              <Progress className="h-2 mt-2" value={storageUsedPercent} />
              <p className="text-xs text-muted-foreground mt-2">
                {(storageTotal - storageUsed).toFixed(1)} GB disponíveis
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tipos de Arquivos</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs">Áudio: {files.filter(f => f.type === 'audio').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs">Documentos: {files.filter(f => f.type === 'document').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs">Imagens: {files.filter(f => f.type === 'image').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-xs">Vídeos: {files.filter(f => f.type === 'video').length}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm font-medium">Total de arquivos: {files.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atividade Recente</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs">Último upload: <span className="font-medium">{files[files.length - 1]?.uploadDate || 'N/A'}</span></p>
                <p className="text-xs">Último acesso: <span className="font-medium">{
                  files.sort((a, b) => 
                    new Date(b.lastAccessed.split('/').reverse().join('-')).getTime() - 
                    new Date(a.lastAccessed.split('/').reverse().join('-')).getTime()
                  )[0]?.lastAccessed || 'N/A'
                }</span></p>
                <div className="text-sm mt-4">
                  <span className="font-medium">{totalFileSize.toFixed(1)} MB</span> de arquivos armazenados
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Arquivos e Recursos no Google Drive</CardTitle>
            <CardDescription>Gerencie músicas, documentos e outros arquivos armazenados no Google Drive do projeto.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar arquivos..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="audio">Áudio</SelectItem>
                    <SelectItem value="document">Documentos</SelectItem>
                    <SelectItem value="image">Imagens</SelectItem>
                    <SelectItem value="video">Vídeos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                <p className="mt-2 text-sm text-gray-500">Carregando arquivos...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Tipo</TableHead>
                      <TableHead>Nome do Arquivo</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Data de Upload</TableHead>
                      <TableHead>Projeto</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.length > 0 ? (
                      filteredFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>{getFileIcon(file.type)}</TableCell>
                          <TableCell className="font-medium">{file.name}</TableCell>
                          <TableCell>{file.size.toFixed(1)} MB</TableCell>
                          <TableCell>{file.uploadDate}</TableCell>
                          <TableCell>{file.projectId}</TableCell>
                          <TableCell>{file.lastAccessed}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDownloadFile(file.id)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenInDrive(file.driveUrl)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Abrir no Google Drive
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600" 
                                  onClick={() => handleDeleteFile(file.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          {searchQuery || filterType !== 'all' ? (
                            <div className="flex flex-col items-center">
                              <Search className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-gray-500">Nenhum arquivo corresponde aos filtros.</p>
                              <Button 
                                variant="link" 
                                onClick={() => {setSearchQuery(''); setFilterType('all');}}
                              >
                                Limpar filtros
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <File className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-gray-500">Nenhum arquivo encontrado.</p>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload de Arquivo para Google Drive</DialogTitle>
              <DialogDescription>
                Envie um arquivo para o Google Drive e vincule-o a um projeto.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  Arquivo
                </Label>
                <Input
                  id="file"
                  type="file"
                  className="col-span-3"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="filename" className="text-right">
                  Nome
                </Label>
                <Input
                  id="filename"
                  className="col-span-3"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="filetype" className="text-right">
                  Tipo
                </Label>
                <Select value={uploadFileType} onValueChange={setUploadFileType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audio">Áudio</SelectItem>
                    <SelectItem value="preview">Prévia</SelectItem>
                    <SelectItem value="document">Documento</SelectItem>
                    <SelectItem value="image">Imagem</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="portfolio">Portfólio</SelectItem>
                    <SelectItem value="invoice">Fatura</SelectItem>
                    <SelectItem value="final_version">Versão Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="projectid" className="text-right">
                  ID do Projeto
                </Label>
                <Input
                  id="projectid"
                  className="col-span-3"
                  value={uploadProjectId}
                  onChange={(e) => setUploadProjectId(e.target.value)}
                  placeholder="Ex: P001"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={handleUpload}>
                Enviar para o Google Drive
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminStorage;
