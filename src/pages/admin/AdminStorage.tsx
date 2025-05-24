import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  FolderOpen, 
  File, 
  Download, 
  Trash2, 
  Search,
  Cloud,
  HardDrive,
  Settings,
  Eye,
  Share
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface StorageItem {
  id: string;
  name: string;
  type: 'folder' | 'audio' | 'image' | 'document';
  size: number;
  modified: string;
  path: string;
  isShared: boolean;
}

const AdminStorage: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const mockStorageItems: StorageItem[] = [
    {
      id: '1',
      name: 'Projeto João Silva',
      type: 'folder',
      size: 1024 * 1024 * 250, // 250MB
      modified: '2024-01-15T10:30:00Z',
      path: '/projetos/joao-silva',
      isShared: false
    },
    {
      id: '2',
      name: 'musica_final.mp3',
      type: 'audio',
      size: 1024 * 1024 * 8, // 8MB
      modified: '2024-01-14T16:45:00Z',
      path: '/projetos/joao-silva/musica_final.mp3',
      isShared: true
    },
    {
      id: '3',
      name: 'briefing.pdf',
      type: 'document',
      size: 1024 * 512, // 512KB
      modified: '2024-01-12T09:20:00Z',
      path: '/projetos/joao-silva/briefing.pdf',
      isShared: false
    }
  ];

  const storageStats = {
    totalSpace: 1024 * 1024 * 1024 * 100, // 100GB
    usedSpace: 1024 * 1024 * 1024 * 45,   // 45GB
    totalFiles: 1247,
    totalFolders: 89
  };

  const usagePercentage = (storageStats.usedSpace / storageStats.totalSpace) * 100;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <FolderOpen className="h-5 w-5 text-blue-500" />;
      case 'audio':
        return <File className="h-5 w-5 text-green-500" />;
      case 'image':
        return <File className="h-5 w-5 text-purple-500" />;
      case 'document':
        return <File className="h-5 w-5 text-red-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simular upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    setIsUploading(false);
    setUploadProgress(0);
  };

  const filteredItems = mockStorageItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Armazenamento</h1>
          <div className="flex items-center gap-2">
            {/* ✅ CORRIGIDO: Removido as prop do Button */}
            <label htmlFor="file-upload">
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Carregar Arquivo
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Storage Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Espaço Usado</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatFileSize(storageStats.usedSpace)}
              </div>
              <Progress value={usagePercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {usagePercentage.toFixed(1)}% de {formatFileSize(storageStats.totalSpace)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Arquivos</CardTitle>
              <File className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageStats.totalFiles.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Em {storageStats.totalFolders} pastas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Backup</CardTitle>
              <Cloud className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ativo</div>
              <p className="text-xs text-muted-foreground">
                Último backup: hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Arquivos Compartilhados</CardTitle>
              <Share className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockStorageItems.filter(item => item.isShared).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Links ativos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Upload className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Enviando arquivo...</span>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar arquivos e pastas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <Select value={viewMode} onValueChange={(value: 'grid' | 'list') => setViewMode(value)}>
                <SelectTrigger className="w-full md:w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">Lista</SelectItem>
                  <SelectItem value="grid">Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* File Browser */}
        <Card>
          <CardHeader>
            <CardTitle>Navegador de Arquivos</CardTitle>
            <div className="text-sm text-muted-foreground">
              Caminho atual: {currentPath}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="files" className="w-full">
              <TabsList>
                <TabsTrigger value="files">Arquivos</TabsTrigger>
                <TabsTrigger value="recent">Recentes</TabsTrigger>
                <TabsTrigger value="shared">Compartilhados</TabsTrigger>
              </TabsList>

              <TabsContent value="files" className="space-y-4">
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(item.type)}
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatFileSize(item.size)} • {new Date(item.modified).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.isShared && (
                          <Badge variant="outline">
                            <Share className="h-3 w-3 mr-1" />
                            Compartilhado
                          </Badge>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recent">
                <div className="text-center py-8">
                  <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Arquivos Recentes</h3>
                  <p className="text-muted-foreground">
                    Os arquivos acessados recentemente aparecerão aqui.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="shared">
                <div className="space-y-2">
                  {filteredItems.filter(item => item.isShared).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(item.type)}
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Compartilhado • {formatFileSize(item.size)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {/* ✅ CORRIGIDO: Removido as prop */}
                        <Button variant="outline" size="sm">
                          Copiar Link
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminStorage;
