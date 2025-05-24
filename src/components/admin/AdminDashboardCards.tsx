
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Music, FileText, PackageOpen, HelpCircle, ArrowRight, 
  FolderOpen, Play, CheckCircle, MessageSquare, Calendar 
} from 'lucide-react';

const AdminDashboardCards: React.FC = () => {
  // Dados simulados para os cards do dashboard
  const stats = {
    newOrders: 12,
    musicInProduction: 8,
    pendingContracts: 3,
    portfolioTotal: 42,
    previews: {
      totalProjects: 10,
      awaitingFeedback: 3,
      feedbackReceived: 2,
      approved: 5,
      expiringSoon: 1,
    },
    audioDatabase: {
      totalSamples: 248,
      categories: 15
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novas Encomendas</CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newOrders}</div>
            <p className="text-xs text-muted-foreground">+2 desde ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Músicas em Produção</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.musicInProduction}</div>
            <p className="text-xs text-muted-foreground">3 em fase final</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingContracts}</div>
            <p className="text-xs text-muted-foreground">+1 desde ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfólio</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.portfolioTotal}</div>
            <p className="text-xs text-muted-foreground">+7 este mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Sistema de Prévias</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{stats.previews.totalProjects}</span>
                  <span className="text-xs text-muted-foreground">Total de projetos</span>
                </div>
                <div className="flex items-center justify-end">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-sm text-yellow-500 mb-1">
                      <span className="mr-1">{stats.previews.awaitingFeedback}</span>
                      <Calendar className="h-3 w-3" />
                      <span className="ml-1">Aguardando</span>
                    </div>
                    <div className="flex items-center text-sm text-blue-500 mb-1">
                      <span className="mr-1">{stats.previews.feedbackReceived}</span>
                      <MessageSquare className="h-3 w-3" />
                      <span className="ml-1">Feedback</span>
                    </div>
                    <div className="flex items-center text-sm text-green-500">
                      <span className="mr-1">{stats.previews.approved}</span>
                      <CheckCircle className="h-3 w-3" />
                      <span className="ml-1">Aprovados</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {stats.previews.expiringSoon > 0 && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{stats.previews.expiringSoon} projeto(s) próximo(s) da expiração</span>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-harmonia-green border-harmonia-green hover:bg-harmonia-green/10"
                asChild
              >
                <Link to="/admin-j28s7d1k/previews">
                  Gerenciar Prévias
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Banco de Áudio</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{stats.audioDatabase.totalSamples}</span>
                  <span className="text-xs text-muted-foreground">Amostras de áudio</span>
                </div>
                <div className="flex items-center justify-end">
                  <div className="text-sm text-muted-foreground">
                    {stats.audioDatabase.categories} categorias
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                asChild
              >
                <Link to="/admin-j28s7d1k/audio-database">
                  Gerenciar Banco de Áudio
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboardCards;
