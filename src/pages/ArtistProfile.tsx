import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Upload, X, User, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ArtistProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role, hasRole } = useUserRole();
  
  const [profile, setProfile] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
    is_artist: false,
    location: '',
    specialty: '',
    exhibitions: [] as string[],
    awards: [] as string[],
    education: '',
    website_url: '',
    social_links: { instagram: '', twitter: '', linkedin: '' }
  });
  
  const [newExhibition, setNewExhibition] = useState('');
  const [newAward, setNewAward] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [artistRequest, setArtistRequest] = useState({ message: '', hasRequest: false, status: 'pending' });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
    checkArtistRequest();
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
          is_artist: data.is_artist || false,
          location: data.location || '',
          specialty: data.specialty || '',
          exhibitions: data.exhibitions || [],
          awards: data.awards || [],
          education: data.education || '',
          website_url: data.website_url || '',
          social_links: (data.social_links as any) || { instagram: '', twitter: '', linkedin: '' }
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

  const checkArtistRequest = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('artist_requests')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      setArtistRequest({
        message: data?.message || '',
        hasRequest: !!data,
        status: data?.status || 'pending'
      });
    } catch (error) {
      console.error('Error checking artist request:', error);
    }
  };

  const submitArtistRequest = async () => {
    if (!user || !artistRequest.message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message for your artist request",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('artist_requests')
        .insert({
          user_id: user.id,
          message: artistRequest.message.trim()
        });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your artist request has been submitted for review",
      });

      setArtistRequest({ message: '', hasRequest: true, status: 'pending' });
    } catch (error) {
      console.error('Error submitting artist request:', error);
      toast({
        title: "Error",
        description: "Failed to submit artist request",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[] | object) => {
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
          is_artist: profile.is_artist,
          location: profile.location,
          specialty: profile.specialty,
          exhibitions: profile.exhibitions,
          awards: profile.awards,
          education: profile.education,
          website_url: profile.website_url,
          social_links: profile.social_links
        }, {
          onConflict: 'user_id'
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

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

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
          {/* Artist Status & Request */}
          {hasRole('artist') ? (
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Artist Status</h3>
                  <p className="text-gray-600 text-sm">
                    You are an approved artist and can showcase your work
                  </p>
                </div>
                <Switch
                  checked={profile.is_artist}
                  onCheckedChange={(checked) => handleInputChange('is_artist', checked)}
                />
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Become an Artist</CardTitle>
              </CardHeader>
              <CardContent>
                {artistRequest.hasRequest && artistRequest.status === 'approved' ? (
                  // Don't show anything for approved requests - the hasRole('artist') check above will handle this case
                  null
                ) : artistRequest.hasRequest && artistRequest.status === 'pending' ? (
                  <div className="text-center py-4">
                    <div className="text-yellow-600 mb-2">⏳ Request Pending</div>
                    <p className="text-sm text-gray-600">
                      Your artist request is under review. You'll be notified once it's processed.
                    </p>
                  </div>
                ) : artistRequest.hasRequest && artistRequest.status === 'rejected' ? (
                  <div className="space-y-4">
                    <div className="text-center py-2">
                      <div className="text-red-600 mb-2">❌ Request Rejected</div>
                      <p className="text-sm text-gray-600 mb-4">
                        Your previous request was not approved. You can submit a new request below.
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Request to become a featured artist and showcase your work in our gallery.
                    </p>
                    <textarea
                      placeholder="Tell us why you'd like to become an artist on our platform..."
                      value={artistRequest.message}
                      onChange={(e) => setArtistRequest({ ...artistRequest, message: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500 resize-none"
                    />
                    <Button
                      onClick={submitArtistRequest}
                      className="w-full"
                      disabled={!artistRequest.message.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit New Artist Request
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Request to become a featured artist and showcase your work in our gallery.
                    </p>
                    <textarea
                      placeholder="Tell us why you'd like to become an artist on our platform..."
                      value={artistRequest.message}
                      onChange={(e) => setArtistRequest({ ...artistRequest, message: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500 resize-none"
                    />
                    <Button
                      onClick={submitArtistRequest}
                      className="w-full"
                      disabled={!artistRequest.message.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Artist Request
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York City"
                  value={profile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty
                </label>
                <input
                  type="text"
                  placeholder="e.g. Contemporary Abstract Artist"
                  value={profile.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education
                </label>
                <input
                  type="text"
                  placeholder="e.g. MFA from Yale School of Art"
                  value={profile.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
              </div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                value={profile.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Social Media</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  placeholder="@username"
                  value={profile.social_links.instagram}
                  onChange={(e) => handleInputChange('social_links', { 
                    ...profile.social_links, 
                    instagram: e.target.value 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <input
                  type="text"
                  placeholder="@username"
                  value={profile.social_links.twitter}
                  onChange={(e) => handleInputChange('social_links', { 
                    ...profile.social_links, 
                    twitter: e.target.value 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="text"
                  placeholder="username"
                  value={profile.social_links.linkedin}
                  onChange={(e) => handleInputChange('social_links', { 
                    ...profile.social_links, 
                    linkedin: e.target.value 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Exhibitions */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Exhibitions</h3>
            
            <div className="space-y-4">
              {profile.exhibitions.map((exhibition, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={exhibition}
                    onChange={(e) => {
                      const updated = [...profile.exhibitions];
                      updated[index] = e.target.value;
                      handleInputChange('exhibitions', updated);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updated = profile.exhibitions.filter((_, i) => i !== index);
                      handleInputChange('exhibitions', updated);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add exhibition (e.g. 2024 • 'Contemporary Visions' • Museum of Modern Art, New York)"
                  value={newExhibition}
                  onChange={(e) => setNewExhibition(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newExhibition.trim()) {
                      handleInputChange('exhibitions', [...profile.exhibitions, newExhibition.trim()]);
                      setNewExhibition('');
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newExhibition.trim()) {
                      handleInputChange('exhibitions', [...profile.exhibitions, newExhibition.trim()]);
                      setNewExhibition('');
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Awards */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Awards & Recognition</h3>
            
            <div className="space-y-4">
              {profile.awards.map((award, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={award}
                    onChange={(e) => {
                      const updated = [...profile.awards];
                      updated[index] = e.target.value;
                      handleInputChange('awards', updated);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updated = profile.awards.filter((_, i) => i !== index);
                      handleInputChange('awards', updated);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add award (e.g. 2024 • Artist of the Year - New York Art Critics Association)"
                  value={newAward}
                  onChange={(e) => setNewAward(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newAward.trim()) {
                      handleInputChange('awards', [...profile.awards, newAward.trim()]);
                      setNewAward('');
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newAward.trim()) {
                      handleInputChange('awards', [...profile.awards, newAward.trim()]);
                      setNewAward('');
                    }
                  }}
                >
                  Add
                </Button>
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