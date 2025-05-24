
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileMusic, DownloadCloud, Check, Folder } from 'lucide-react';

const GoogleDriveGuide: React.FC = () => {
  return (
    <Card className="border-dashed border-2 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <FileMusic className="w-5 h-5 mr-2 text-harmonia-green" />
          Como adicionar músicas no portfólio
        </CardTitle>
        <CardDescription>
          Guia passo a passo para adicionar músicas ao portfólio usando o Google Drive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="bg-harmonia-green/20 p-2 rounded-full flex-shrink-0">
              <span className="text-harmonia-green font-bold">1</span>
            </div>
            <div>
              <h3 className="font-medium mb-1">Acesse a pasta do Google Drive</h3>
              <p className="text-sm text-gray-500">
                Acesse a pasta "Portfolio" dentro do seu Google Drive usando o link abaixo:
              </p>
              <a 
                href="https://drive.google.com/drive/folders/1MJk2diD6Bmb9Q6lNVDPnLePAznerOU29" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-500 flex items-center mt-1 hover:underline"
              >
                <Folder className="w-4 h-4 mr-1" />
                Abrir pasta no Google Drive
                <ArrowRight className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-harmonia-green/20 p-2 rounded-full flex-shrink-0">
              <span className="text-harmonia-green font-bold">2</span>
            </div>
            <div>
              <h3 className="font-medium mb-1">Faça upload dos arquivos de áudio</h3>
              <p className="text-sm text-gray-500">
                Arraste e solte os arquivos MP3 ou WAV na pasta do Google Drive. Certifique-se de que:
              </p>
              <ul className="text-sm text-gray-500 list-disc pl-5 mt-1 space-y-1">
                <li>Arquivos estejam nomeados corretamente (ex: "Nome da Música - Artista.mp3")</li>
                <li>Arquivos sejam MP3 ou WAV com boa qualidade</li>
                <li>O tamanho máximo recomendado é de 15MB por arquivo</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-harmonia-green/20 p-2 rounded-full flex-shrink-0">
              <span className="text-harmonia-green font-bold">3</span>
            </div>
            <div>
              <h3 className="font-medium mb-1">Configure o compartilhamento</h3>
              <p className="text-sm text-gray-500">
                Verifique se os arquivos estão com a permissão correta de compartilhamento:
              </p>
              <ol className="text-sm text-gray-500 list-decimal pl-5 mt-1 space-y-1">
                <li>Clique com o botão direito no arquivo e selecione "Compartilhar"</li>
                <li>Certifique-se de que a opção "Qualquer pessoa com o link" esteja selecionada</li>
                <li>Defina a permissão como "Leitor"</li>
                <li>Clique em "Concluído"</li>
              </ol>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-harmonia-green/20 p-2 rounded-full flex-shrink-0">
              <span className="text-harmonia-green font-bold">4</span>
            </div>
            <div>
              <h3 className="font-medium mb-1">Cadastre no painel administrativo</h3>
              <p className="text-sm text-gray-500">
                Após fazer o upload, use o formulário abaixo para cadastrar a música no sistema:
              </p>
              <div className="text-sm text-gray-500 space-y-1 mt-1">
                <p>• Preencha o nome da música e artista</p>
                <p>• Cole o ID ou link do Google Drive do arquivo</p>
                <p>• Selecione a categoria e adicione tags relevantes</p>
                <p>• Clique em "Adicionar ao Portfólio"</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-harmonia-green/20 p-2 rounded-full flex-shrink-0">
              <span className="text-harmonia-green font-bold">5</span>
            </div>
            <div>
              <h3 className="font-medium mb-1">Verifique a integração</h3>
              <p className="text-sm text-gray-500">
                Após cadastrar, verifique se a música está aparecendo corretamente:
              </p>
              <div className="flex items-center gap-2 mt-2">
                <a 
                  href="/portfolio" 
                  target="_blank"
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded flex items-center"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Verificar no site
                </a>
                <button 
                  className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center"
                  onClick={() => window.location.reload()}
                >
                  <DownloadCloud className="w-3 h-3 mr-1" />
                  Atualizar página
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-yellow-800 text-sm">
          <p className="font-medium">Observação importante:</p>
          <p className="mt-1">
            O Google Drive pode levar alguns minutos para processar arquivos de áudio recém-enviados.
            Se a música não aparecer imediatamente, aguarde alguns minutos e atualize a página.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleDriveGuide;
