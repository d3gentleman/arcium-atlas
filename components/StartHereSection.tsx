import ActionLink from './ActionLink';
import { LinkAction } from '../types/domain';

interface StartHereCard {
  prefix: string;
  tag: string;
  title: string;
  description: string;
  action: LinkAction;
}

export default function StartHereSection({ cards }: { cards: StartHereCard[] }) {
  return (
    <section className="console-window col-span-12">
      <div className="console-header">
        <span>MODULE_02: START_HERE</span>
        <span className="text-primary">CORE_SYSTEMS: ONBOARDING</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {(cards || []).map((card, idx) => (
          <div
            key={idx}
            className={`p-8 hover:bg-primary/5 transition-all group relative overflow-hidden ${idx !== cards.length - 1 ? 'md:border-r-2 md:border-outline-variant/30' : ''}`}
          >
            <div className="absolute -right-4 -top-4 text-primary/5 text-8xl font-black select-none group-hover:text-primary/10 transition-colors">
              {card.prefix}
            </div>

            <div className="text-[10px] text-primary mb-4 font-bold tracking-widest uppercase">{card.tag}</div>
            <h3 className="text-2xl font-black mb-4 uppercase">{card.title}</h3>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{card.description}</p>
            <ActionLink
              action={card.action}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-primary hover:underline"
              unavailableClassName="inline-flex items-center gap-2 text-[10px] font-black uppercase text-outline cursor-not-allowed"
            >
              {card.action.label} <span className="group-hover:translate-x-1 transition-transform">&gt;&gt;</span>
            </ActionLink>
          </div>
        ))}
      </div>
    </section>
  );
}
