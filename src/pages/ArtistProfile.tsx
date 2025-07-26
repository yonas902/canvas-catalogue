import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Upload, X, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ArtistProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
    is_artist: false
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Redirect if not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          display_name: data.display_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          is_artist: data.is_artist || false
        });
        setAvatarPreview(data.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('artwork-images')
      .upload(fileName, file, { upsert: true });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('artwork-images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const handleSave = async () => {
    if (!profile.display_name.trim()) {
      toast({
        title: "Error",
        description: "Display name is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: profile.display_name,
          bio: profile.bio,
          avatar_url: avatarUrl,
          is_artist: profile.is_artist
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: profile.is_artist 
          ? "Artist profile saved successfully!" 
          : "Profile updated successfully!",
      });
      
      if (profile.is_artist) {
        navigate('/artists');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-medium text-gray-900">
            {profile.is_artist ? 'Artist Profile' : 'Create Artist Profile'}
          </h1>
          <p className="text-gray-600 mt-1">
            {profile.is_artist 
              ? 'Manage your artist profile and showcase your work'
              : 'Join our community of artists and start showcasing your work'
            }
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Artist Toggle */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Artist Status</h3>
                <p className="text-gray-600 text-sm">
                  Enable this to become a featured artist and showcase your work
                </p>
              </div>
              <Switch
                checked={profile.is_artist}
                onCheckedChange={(checked) => handleInputChange('is_artist', checked)}
              />
            </div>
          </div>

          {/* Profile Photo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                >
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Drag and drop your photo here</p>
                      <p className="text-gray-500">or</p>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <Button variant="outline" className="mt-2">
                          Choose Photo
                        </Button>
                      </label>
                    </div>
                    {avatarPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                          setProfile(prev => ({ ...prev, avatar_url: '' }));
                        }}
                        className="mt-2"
                      >
                        <X size={16} className="mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name *
              </label>
              <input
                type="text"
                placeholder="Enter your display name"
                value={profile.display_name}
                onChange={(e) => handleInputChange('display_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                placeholder="Tell us about yourself, your artistic journey, and your style..."
                value={profile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500 resize-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                {profile.bio.length}/1000 characters
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;