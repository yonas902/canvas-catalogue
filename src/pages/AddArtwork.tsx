import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddArtwork = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    medium: '',
    width: '',
    height: '',
    depth: '',
    price: '',
    currency: 'USD',
    tags: '',
    edition_details: '',
    is_available: true
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress] = useState(60);

  // Redirect if not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('artwork-images')
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('artwork-images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const handleSave = async (isDraft: boolean) => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const dimensions = [formData.width, formData.height, formData.depth]
        .filter(d => d.trim())
        .join(' x ') + ' cm';

      const { error } = await supabase
        .from('artworks')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          medium: formData.medium,
          dimensions: dimensions || null,
          price: formData.price ? parseFloat(formData.price) : null,
          image_url: imageUrl,
          artist_id: user.id,
          artist_name: user.user_metadata?.display_name || user.email || 'Unknown Artist',
          is_available: isDraft ? false : formData.is_available
        });

      if (error) throw error;

      toast({
        title: isDraft ? "Draft saved" : "Artwork published",
        description: isDraft ? "Your artwork has been saved as a draft" : "Your artwork has been published successfully",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error saving artwork:', error);
      toast({
        title: "Error",
        description: "Failed to save artwork. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-medium text-gray-900">Add New Artwork</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Progress</span>
            <div className="w-32">
              <Progress value={progress} className="h-2" />
            </div>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Information */}
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Enter artwork title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe your artwork"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500 resize-none"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Painting">Painting</SelectItem>
                      <SelectItem value="Sculpture">Sculpture</SelectItem>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="Digital Art">Digital Art</SelectItem>
                      <SelectItem value="Mixed Media">Mixed Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medium</label>
                  <input
                    type="text"
                    placeholder="e.g. Oil on canvas"
                    value={formData.medium}
                    onChange={(e) => handleInputChange('medium', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Dimensions</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                  <input
                    type="number"
                    placeholder="cm"
                    value={formData.width}
                    onChange={(e) => handleInputChange('width', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                  <input
                    type="number"
                    placeholder="cm"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Depth</label>
                  <input
                    type="number"
                    placeholder="cm"
                    value={formData.depth}
                    onChange={(e) => handleInputChange('depth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Images and Additional Details */}
          <div className="space-y-8">
            {/* Artwork Images */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Artwork Images</h2>
              
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                    />
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Drag and drop your images here</p>
                      <p className="text-gray-500">or</p>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button variant="outline" className="mt-2">
                          Choose File
                        </Button>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, GIF (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Additional Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="Add tags separated by commas"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Edition Details</label>
                <input
                  type="text"
                  placeholder="e.g. 1/1, 1/50"
                  value={formData.edition_details}
                  onChange={(e) => handleInputChange('edition_details', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Visibility</label>
                <Switch
                  checked={formData.is_available}
                  onCheckedChange={(checked) => handleInputChange('is_available', checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={() => handleSave(true)}
              disabled={loading}
            >
              Save as Draft
            </Button>
            <Button 
              onClick={() => handleSave(false)}
              disabled={loading}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {loading ? 'Publishing...' : 'Publish Artwork'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddArtwork;