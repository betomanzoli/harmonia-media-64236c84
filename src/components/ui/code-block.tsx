
import * as React from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ 
  code, 
  language = "javascript", 
  showLineNumbers = true 
}: CodeBlockProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = React.useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    
    toast({
      title: "Código copiado!",
      description: "O código foi copiado para sua área de transferência."
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  return (
    <div className="relative my-4 rounded-md overflow-hidden border">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/60"
        onClick={handleCopy}
      >
        <Copy className="h-4 w-4" />
        <span className="sr-only">Copy code</span>
      </Button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: '0.375rem',
          fontSize: '0.875rem'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
