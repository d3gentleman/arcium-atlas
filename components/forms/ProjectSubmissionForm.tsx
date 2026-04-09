'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  submissionSchema,
  PROJECT_CATEGORIES,
  type SubmissionFormData,
} from '@/lib/schemas/submissionSchema';
import ConsoleInput from './ConsoleInput';
import ConsoleTextarea from './ConsoleTextarea';
import ConsoleSelect from './ConsoleSelect';
import LogoUpload from './LogoUpload';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ProjectSubmissionForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      teamMembers: [],
      additionalContext: '',
      discordInvite: '',
      telegramInvite: '',
      logoUrl: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'teamMembers',
  });

  const logoUrl = watch('logoUrl');

  const onSubmit = async (data: SubmissionFormData) => {
    setStatus('submitting');
    setServerError(null);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Submission failed');
      }
      setStatus('success');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  // ── Success State ──────────────────────────────
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="console-window overflow-hidden"
      >
        <div className="console-header">
          <span>SUBMISSION_ENGINE</span>
          <span className="text-[#00ffa3]">TX_VERIFIED</span>
        </div>
        <div className="relative p-8 text-center space-y-4">
          <div className="scanline-effect absolute inset-0 opacity-[0.03] pointer-events-none" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mx-auto h-16 w-16 flex items-center justify-center border-2 border-[#00ffa3]/50 text-[#00ffa3] text-2xl"
          >
            ✓
          </motion.div>
          <h2 className="text-xl font-headline text-[#00ffa3]">
            TRANSACTION VERIFIED
          </h2>
          <p className="text-sm text-outline max-w-md mx-auto">
            Your project submission has been received and queued for review.
            You will be contacted via the email provided once the review is complete.
          </p>
          <div className="pt-4 text-[10px] text-outline/50 font-body">
            {'>'} SUBMISSION_ID: {Date.now().toString(36).toUpperCase()}
            <br />
            {'>'} STATUS: PENDING_REVIEW
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Submitting Overlay ─────────────────────────
  const submittingOverlay = status === 'submitting' && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <div className="space-y-3 text-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary text-sm font-body"
        >
          {'>'} INITIALIZING UPLOAD SEQUENCE...
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'linear' }}
          className="h-[2px] bg-primary/60 max-w-[200px] mx-auto"
        />
        <div className="text-[10px] text-outline/50">
          VERIFYING PAYLOAD INTEGRITY
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
      noValidate
    >
      {/* ════════════════════════════════════════════
          SECTION 1 — BASIC INFO
          ════════════════════════════════════════════ */}
      <section className="console-window overflow-hidden">
        <div className="console-header">
          <span>SEC_01: BASIC_INFO</span>
          <span className="text-primary">REQUIRED</span>
        </div>
        <div className="relative p-6 space-y-5">
          <div className="scanline-effect absolute inset-0 opacity-[0.03] pointer-events-none" />
          <div className="grid gap-5 sm:grid-cols-2">
            <ConsoleInput
              label="Name or Alias"
              required
              placeholder="Your name or alias"
              error={errors.submitterName?.message}
              {...register('submitterName')}
            />
            <ConsoleInput
              label="Email"
              type="email"
              required
              placeholder="you@example.com"
              error={errors.submitterEmail?.message}
              {...register('submitterEmail')}
            />
          </div>
          <ConsoleInput
            label="Your Role in Project"
            required
            placeholder="e.g. Lead Developer, Co-founder"
            error={errors.submitterRole?.message}
            {...register('submitterRole')}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <ConsoleInput
              label="Discord Username"
              required
              placeholder="username#0000"
              error={errors.discordUsername?.message}
              {...register('discordUsername')}
            />
            <ConsoleInput
              label="Telegram Username"
              required
              placeholder="@username"
              error={errors.telegramUsername?.message}
              {...register('telegramUsername')}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 2 — TEAM INFORMATION
          ════════════════════════════════════════════ */}
      <section className="console-window overflow-hidden">
        <div className="console-header">
          <span>SEC_02: TEAM_INFO</span>
          <span className="text-primary">REQUIRED</span>
        </div>
        <div className="relative p-6 space-y-5">
          <div className="scanline-effect absolute inset-0 opacity-[0.03] pointer-events-none" />

          {/* Founder (always visible) */}
          <div className="grid gap-5 sm:grid-cols-2">
            <ConsoleInput
              label="Founder's Name or Alias"
              required
              placeholder="Founder name"
              error={errors.founderName?.message}
              {...register('founderName')}
            />
            <ConsoleInput
              label="Founder's X/Twitter URL"
              type="url"
              required
              placeholder="https://x.com/founder"
              error={errors.founderTwitter?.message}
              {...register('founderTwitter')}
            />
          </div>

          {/* Dynamic Team Members */}
          <AnimatePresence mode="popLayout">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="border border-outline-variant/20 bg-surface-container-low/40 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline/60">
                      TEAM_MEMBER_{String(index + 1).padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-[10px] text-outline/40 hover:text-error transition-colors px-2 py-0.5 border border-transparent hover:border-error/30"
                    >
                      ✕ REMOVE
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <ConsoleInput
                      label="Role"
                      required
                      placeholder="e.g. CTO"
                      error={errors.teamMembers?.[index]?.role?.message}
                      {...register(`teamMembers.${index}.role`)}
                    />
                    <ConsoleInput
                      label="Name or Alias"
                      required
                      placeholder="Team member name"
                      error={errors.teamMembers?.[index]?.name?.message}
                      {...register(`teamMembers.${index}.name`)}
                    />
                    <ConsoleInput
                      label="Twitter/X URL"
                      type="url"
                      required
                      placeholder="https://x.com/member"
                      error={errors.teamMembers?.[index]?.twitter?.message}
                      {...register(`teamMembers.${index}.twitter`)}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Team Member Button */}
          {fields.length < 3 && (
            <div className="pt-2 space-y-1.5">
              <button
                type="button"
                onClick={() => append({ role: '', name: '', twitter: '' })}
                className="
                  border border-dashed border-outline-variant/25 bg-transparent
                  px-4 py-2 text-[11px] text-outline/60
                  transition-all duration-200
                  hover:border-primary/40 hover:text-primary/80 hover:bg-primary/5
                "
              >
                + ADD TEAM MEMBER
              </button>
              <p className="text-[10px] text-outline/40 pl-1">
                Optionally add up to {3 - fields.length} more team member{3 - fields.length !== 1 ? 's' : ''}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 3 — PROJECT INFORMATION
          ════════════════════════════════════════════ */}
      <section className="console-window overflow-hidden">
        <div className="console-header">
          <span>SEC_03: PROJECT_DATA</span>
          <span className="text-primary">REQUIRED</span>
        </div>
        <div className="relative p-6 space-y-5">
          <div className="scanline-effect absolute inset-0 opacity-[0.03] pointer-events-none" />

          <ConsoleInput
            label="Project Name"
            required
            placeholder="Your project name"
            error={errors.projectName?.message}
            {...register('projectName')}
          />
          <ConsoleTextarea
            label="Project Summary"
            required
            placeholder="Briefly describe what your project does..."
            error={errors.projectSummary?.message}
            {...register('projectSummary')}
          />
          <ConsoleTextarea
            label="Explain Arcium's Role in the Project"
            required
            placeholder="How does your project integrate with or leverage Arcium?"
            error={errors.arciumRole?.message}
            {...register('arciumRole')}
          />

          {/* Logo Upload */}
          <LogoUpload
            value={logoUrl}
            onChange={(url) => setValue('logoUrl', url, { shouldValidate: true })}
            error={errors.logoUrl?.message}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 4 — SOCIALS
          ════════════════════════════════════════════ */}
      <section className="console-window overflow-hidden">
        <div className="console-header">
          <span>SEC_04: SOCIALS</span>
          <span className="text-primary">REQUIRED</span>
        </div>
        <div className="relative p-6 space-y-5">
          <div className="scanline-effect absolute inset-0 opacity-[0.03] pointer-events-none" />

          <ConsoleSelect
            label="Project Category"
            required
            options={PROJECT_CATEGORIES}
            placeholder="Select sector..."
            error={errors.category?.message}
            {...register('category')}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <ConsoleInput
              label="Website"
              type="url"
              required
              placeholder="https://yourproject.com"
              error={errors.website?.message}
              {...register('website')}
            />
            <ConsoleInput
              label="Twitter"
              type="url"
              required
              placeholder="https://x.com/project"
              error={errors.projectTwitter?.message}
              {...register('projectTwitter')}
            />
          </div>
          <ConsoleInput
            label="Email"
            type="email"
            required
            placeholder="contact@project.com"
            error={errors.projectEmail?.message}
            {...register('projectEmail')}
          />

          {/* Optional Socials */}
          <div className="border-t border-outline-variant/15 pt-5 space-y-5">
            <div className="text-[10px] text-outline/40 uppercase tracking-[0.2em]">
              Optional
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <ConsoleInput
                label="Discord Invite"
                type="url"
                placeholder="https://discord.gg/..."
                error={errors.discordInvite?.message}
                {...register('discordInvite')}
              />
              <ConsoleInput
                label="Telegram Invite"
                type="url"
                placeholder="https://t.me/..."
                error={errors.telegramInvite?.message}
                {...register('telegramInvite')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 5 — ADDITIONAL CONTEXT
          ════════════════════════════════════════════ */}
      <section className="console-window overflow-hidden">
        <div className="console-header">
          <span>SEC_05: ADDITIONAL_CONTEXT</span>
          <span className="text-outline/50">OPTIONAL</span>
        </div>
        <div className="relative p-6">
          <div className="scanline-effect absolute inset-0 opacity-[0.03] pointer-events-none" />
          <ConsoleTextarea
            label="Additional Context"
            placeholder="Use this space to fill in any gaps or provide additional information about your project..."
            hint="This field is optional. Provide any extra context you think would help our review."
            error={errors.additionalContext?.message}
            {...register('additionalContext')}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SUBMIT
          ════════════════════════════════════════════ */}
      <div className="console-window overflow-hidden relative">
        {submittingOverlay}
        <div className="console-header">
          <span>EXEC_SUBMIT</span>
          <span className={status === 'error' ? 'text-error' : 'text-primary'}>
            {status === 'error' ? 'TX_FAILED' : 'READY'}
          </span>
        </div>
        <div className="p-6 space-y-4">
          {serverError && (
            <div className="border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
              <span className="text-error/60 select-none mr-2">⚠ ERR:</span>
              {serverError}
            </div>
          )}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="
              w-full border-2 border-primary/60 bg-primary/10
              px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary
              transition-all duration-200
              hover:bg-primary/20 hover:shadow-[0_0_24px_rgba(0,240,255,0.15)]
              active:bg-primary/30
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {status === 'submitting' ? '> PROCESSING...' : '> SUBMIT PROJECT'}
          </button>
          <p className="text-center text-[10px] text-outline/40">
            All fields marked with <span className="text-primary">*</span> are mandatory.
            Your submission will be reviewed by the Atlas team.
          </p>
        </div>
      </div>
    </motion.form>
  );
}
