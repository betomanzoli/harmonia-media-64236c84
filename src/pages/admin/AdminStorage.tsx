
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FolderOpen, RefreshCw, Settings } from 'lucide-react';
import StorageIntegrationDashboard from '@/components/admin/storage/StorageIntegrationDashboard';

const AdminStorage: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Mock data
  const storageUsage = {
    used: 1.5, // GB
    total: 5, // GB
    percentage: 30 // %
  };
  
  const mockUploadFile = async (file: File) => {
    setIsUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add the file to the list
    const newFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    };
    
    setFiles(prev => [...prev, newFile]);
    setIsUploading(false);
    
    return {
      success: true,
      url: `https://example.com/files/${file.name}`,
      key: newFile.id,
      filename: file.name
    };
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await mockUploadFile(selectedFile);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Armazenamento</h1>
            <p className="text-gray-500">Gerencie arquivos e backups do sistema</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <div>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button 
                as="label" 
                htmlFor="file-upload"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Carregar Arquivo
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Arquivos</CardTitle>
              </CardHeader>
              <CardContent>
                {files.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-2">Nome</th>
                        <th className="pb-2">Tipo</th>
                        <th className="pb-2">Tamanho</th>
                        <th className="pb-2">Data</th>
                        <th className="pb-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map(file => (
                        <tr key={file.id} className="border-b">
                          <td className="py-2">{file.name}</td>
                          <td>{file.type}</td>
                          <td>{Math.round(file.size / 1024)} KB</td>
                          <td>{new Date(file.uploadedAt).toLocaleDateString()}</td>
                          <td>
                            <Button variant="ghost" size="sm">
                              Baixar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8">
                    <FolderOpen className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">Nenhum arquivo encontrado</p>
                    <Button variant="outline" className="mt-4" as="label" htmlFor="file-upload">
                      Carregar Arquivo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Uso de Armazenamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">{storageUsage.percentage}%</div>
                  <p className="text-gray-500">{storageUsage.used} GB de {storageUsage.total} GB</p>
                  <div className="w-full h-3 bg-gray-200 rounded-full mt-4">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${storageUsage.percentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <StorageIntegrationDashboard />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStorage;
