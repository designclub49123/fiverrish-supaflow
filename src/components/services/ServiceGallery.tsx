
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ServiceGalleryProps {
  images: string[];
  title: string;
}

export default function ServiceGallery({ images, title }: ServiceGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  const openImageDialog = (index: number) => {
    setSelectedImageIndex(index);
    setIsDialogOpen(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div 
          className="aspect-video relative cursor-pointer overflow-hidden rounded-lg"
          onClick={() => openImageDialog(0)}
        >
          <img
            src={images[0]}
            alt={`${title} - Main image`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              1 / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((image, index) => (
              <div
                key={index + 1}
                className="aspect-square relative cursor-pointer overflow-hidden rounded"
                onClick={() => openImageDialog(index + 1)}
              >
                <img
                  src={image}
                  alt={`${title} - Image ${index + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white font-medium">
                    +{images.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/70 hover:bg-black/80 rounded-full text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/70 hover:bg-black/80 rounded-full text-white transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/70 hover:bg-black/80 rounded-full text-white transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            <img
              src={images[selectedImageIndex]}
              alt={`${title} - Image ${selectedImageIndex + 1}`}
              className="w-full max-h-[80vh] object-contain"
            />

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="p-4 bg-gray-50">
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                      index === selectedImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
