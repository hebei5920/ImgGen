"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Download, 
  MoreHorizontal, 
  Share2, 
  Clipboard, 
  Info,
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import type { GeneratedImage } from '@/components/generate/generator-page';

export interface GeneratorOutputProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  isAuthenticated?: boolean;
}

export function GeneratorOutput({ 
  images, 
  isGenerating,
  isAuthenticated = true 
}: GeneratorOutputProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const t = useTranslations();

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: t('generator.output.toast.copyPrompt.title'),
      description: t('generator.output.toast.copyPrompt.description'),
    });
  };

  const getGridCols = () => {
    return images.length === 1 ? 'grid-cols-1' :
           images.length === 2 ? 'grid-cols-2' : 
           'grid-cols-2 md:grid-cols-3';
  };

  return (
    <div className="w-full min-h-[500px] bg-card rounded-xl border border-border shadow-sm p-4">
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center h-[500px]">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground mt-4">
            {t('generator.output.generating')}
          </p>
        </div>
      ) : images.length > 0 ? (
        <div className={`grid ${getGridCols()} gap-4`}>
          <AnimatePresence>
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-lg overflow-hidden group"
              >
                <Image
                  src={image.url}
                  alt={image.prompt}
                  width={500}
                  height={500}
                  className="object-cover w-full aspect-square"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleCopyPrompt(image.prompt)}>
                          <Clipboard className="h-4 w-4 mr-2" />
                          {t('generator.output.actions.copyPrompt')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          {t('generator.output.actions.share')}
                        </DropdownMenuItem>
                        <DialogTrigger asChild onClick={() => setSelectedImage(image)}>
                          <DropdownMenuItem>
                            <Info className="h-4 w-4 mr-2" />
                            {t('generator.output.actions.details')}
                          </DropdownMenuItem>
                        </DialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div>
                    <p className="text-white text-sm line-clamp-2 mb-2">
                      {image.prompt}
                    </p>
                    <Button variant="secondary" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" /> {t('generator.output.actions.download')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[500px] text-center">
          <div className="bg-muted rounded-full p-4 mb-4">
            <Image
              src="https://images.pexels.com/photos/3493777/pexels-photo-3493777.jpeg"
              alt="Example image"
              width={80}
              height={80}
              className="rounded-full opacity-20"
            />
          </div>
          <h3 className="text-lg font-medium mb-2">{t('generator.output.empty.title')}</h3>
          <p className="text-muted-foreground max-w-md">
            {t('generator.output.empty.description')}
          </p>
        </div>
      )}

      {/* Image Details Dialog */}
      <Dialog>
        <DialogContent className="max-w-2xl">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>{t('generator.output.details.title')}</DialogTitle>
                <DialogDescription>
                  {t('generator.output.details.description')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.prompt}
                    width={500}
                    height={500}
                    className="object-cover w-full"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('generator.output.details.prompt')}</h4>
                    <p className="text-sm">{selectedImage.prompt}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('generator.output.details.aspectRatio')}</h4>
                      <Badge variant="outline">{selectedImage.aspectRatio}</Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('generator.output.details.seed')}</h4>
                      <Badge variant="outline">{selectedImage.seed}</Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('generator.output.details.steps')}</h4>
                      <Badge variant="outline">{selectedImage.steps}</Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('generator.output.details.generated')}</h4>
                      <Badge variant="outline">
                        {selectedImage.timestamp.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex flex-col gap-2">
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" /> {t('generator.output.details.actions.download')}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" /> {t('generator.output.details.actions.openEditor')}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}