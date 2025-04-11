
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileMusic, AlertTriangle, CheckCircle, MessageSquare, ArrowRight, Calculator, FileCheck, CheckSquare } from "lucide-react";

const DashboardPreviewsCard: React.FC = () => {
  // Dados simulados para o card
  const previewsStats = {
    totalProjects: 10,
    awaitingFeedback: 3,
    feedbackReceived: 2,
    approved: 5,
    expiringSoon: 1,
  };

  return (
    <Card className="bg-gray-800/60 border-gray-700 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium text-gray-200">Sistema de Prévias</CardTitle>
        <FileMusic className="h-4 w-4 text-harmonia-green" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">{previewsStats.totalProjects}</span>
              <span className="text-xs text-gray-400">Total de projetos</span>
            </div>
            <div className="flex items-center justify-end">
              <div className="flex flex-col items-end">
                <div className="flex items-center text-sm text-yellow-500 mb-1">
                  <span className="mr-1">{previewsStats.awaitingFeedback}</span>
                  <AlertTriangle className="h-3 w-3" />
                </div>
                <div className="flex items-center text-sm text-blue-500 mb-1">
                  <span className="mr-1">{previewsStats.feedbackReceived}</span>
                  <MessageSquare className="h-3 w-3" />
                </div>
                <div className="flex items-center text-sm text-green-500">
                  <span className="mr-1">{previewsStats.approved}</span>
                  <CheckCircle className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
          
          {previewsStats.expiringSoon > 0 && (
            <div className="p-2 bg-amber-900/30 border border-amber-800/50 rounded text-xs text-amber-400 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>{previewsStats.expiringSoon} projeto(s) próximo(s) da expiração</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-harmonia-green border-harmonia-green/40 hover:bg-harmonia-green/10"
              asChild
            >
              <Link to="/admin-j28s7d1k/previews">
                Gerenciar Prévias
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
            
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-700/50"
                asChild
              >
                <Link to="/calculadora">
                  <Calculator className="h-3 w-3 mr-1" />
                  Calculadora
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-700/50"
                asChild
              >
                <Link to="/qualificacao">
                  <FileCheck className="h-3 w-3 mr-1" />
                  Qualificação
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-700/50"
                asChild
              >
                <Link to="/admin-j28s7d1k/orders">
                  <CheckSquare className="h-3 w-3 mr-1" />
                  Entregas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPreviewsCard;
