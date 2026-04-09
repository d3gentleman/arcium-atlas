import ProjectSubmissionForm from '@/components/forms/ProjectSubmissionForm';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Submit a Project',
  description:
    'Submit your project for inclusion in the Arcium Atlas ecosystem directory. Join the growing network of builders.',
  path: '/submit',
});

export default function SubmitPage() {
  return (
    <KnowledgePageFrame
      eyebrow="ATLAS // BUILDER_SUBMISSION"
      title="Submit Your Project"
      summary="Register your project for inclusion in the Arcium ecosystem directory. Complete the form below to begin the review process. All required fields are marked with an asterisk."
      statusLabel="INTAKE_OPEN"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Ecosystem', href: '/ecosystem' },
        { label: 'Submit', href: '/submit' },
      ]}
      meta={
        <>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            TYPE // PROJECT SUBMISSION
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            REVIEW // MANUAL
          </div>
        </>
      }
      backgroundVariant="calm"
    >
      <ProjectSubmissionForm />
    </KnowledgePageFrame>
  );
}
