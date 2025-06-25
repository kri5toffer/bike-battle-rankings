
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, MessageCircle, CheckCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Store in database
      const { error: dbError } = await supabase
        .from('contacts')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      // Send email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't throw here - the message was still saved to database
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto bg-white border-2 border-black">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="relative">
              <CheckCircle className="mx-auto text-black" size={64} />
              <div className="absolute -top-2 -right-2">
                <Mail className="text-black animate-pulse" size={24} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black mb-2">Message Sent!</h3>
              <p className="text-black mb-4">
                Thanks for reaching out! I'll get back to you as soon as possible.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="bg-white border-2 border-black text-black hover:bg-black hover:text-white"
              >
                Send Another Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto bg-white border-2 border-black">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-black text-center flex items-center justify-center gap-2">
          <MessageCircle className="text-black" size={28} />
          Contact Me
        </CardTitle>
        <p className="text-black text-center">
          Have questions about yourbikevsmybike? I'd love to hear from you!
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black font-medium">
                Your Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
                className="bg-white border-2 border-black text-black placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-black font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className="bg-white border-2 border-black text-black placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-black font-medium">
              Your Message *
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Tell me what's on your mind..."
              rows={6}
              className="bg-white border-2 border-black text-black placeholder-gray-400"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-white hover:text-black border-2 border-black py-3 text-lg font-semibold"
            disabled={isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.message.trim()}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
