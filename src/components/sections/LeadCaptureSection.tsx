import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { submitLead } from '@/src/data/public';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const leadSchema = z.object({
  full_name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  message: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export function LeadCaptureSection() {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormValues) => {
    setState('loading');
    try {
      await submitLead(data);
      setState('success');
      reset();
    } catch (error) {
      console.error(error);
      setState('error');
    }
  };

  return (
    <section className="bg-dark py-24 overflow-hidden relative" id="contato-lead">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-primary text-xs font-bold uppercase tracking-widest">
              <span>Vamos Evoluir?</span>
            </div>
            <h2 className="text-4xl lg:text-5xl text-white">
              Pronto para transformar sua <span className="text-primary tracking-tighter">presença digital?</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Deixe seus dados e nosso time de especialistas entrará em contato em até 24h para um diagnóstico gratuito do seu ecossistema digital.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                'Diagnóstico de performance gratuito',
                'Planejamento de arquitetura customizado',
                'Foco total em conversão e resultados',
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-white/80">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {state === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10 space-y-4"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold">Solicitação Enviada!</h3>
                  <p className="text-gray-500">Já recebemos seu interesse. Em breve você receberá uma mensagem da Life Dev.</p>
                  <Button onClick={() => setState('idle')} variant="outline" className="mt-4">
                    Enviar outro
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <Input
                    label="Nome Completo"
                    placeholder="Ex: Leonardo Freire"
                    error={errors.full_name?.message}
                    {...register('full_name')}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="E-mail"
                      type="email"
                      placeholder="seu@email.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                    <Input
                      label="WhatsApp/Telefone"
                      placeholder="(11) 99999-9999"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-dark-muted ml-0.5">Como podemos ajudar?</label>
                    <textarea
                      placeholder="Conte um pouco sobre seu projeto..."
                      className="w-full h-32 rounded-xl border border-surface-border bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      {...register('message')}
                    ></textarea>
                  </div>
                  
                  {state === 'error' && (
                    <div className="p-4 bg-red-50 rounded-xl flex items-center space-x-3 text-red-700 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p>Ocorreu um erro ao enviar. Por favor, tente novamente.</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full lg:h-14 lg:text-lg"
                    isLoading={state === 'loading'}
                  >
                    Solicitar Diagnóstico Gratuito
                  </Button>

                  <p className="text-[10px] text-center text-gray-400">
                    Ao enviar, você concorda com nossa Política de Privacidade e aceita receber comunicações comerciais.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
