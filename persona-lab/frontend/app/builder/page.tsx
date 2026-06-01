"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Sidebar from "@/components/layout/Sidebar";
import StepIndicator from "@/components/builder/StepIndicator";
import PersonaForm from "@/components/builder/PersonaForm";
import KnowledgeBase from "@/components/builder/KnowledgeBase";
import PersonaReview from "@/components/builder/PersonaReview";
import { Persona, Document } from "@/lib/types";
import { api } from "@/lib/api";

export default function BuilderPage() {
  const router = useRouter();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [draft, setDraft] = useState<Partial<Persona>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    api.getPersonas().then((ps) => {
      setPersonas(ps);
      // Default to the first persona (Senior Lab Technician) on load
      if (ps.length > 0) {
        setActiveId(ps[0].id);
        setDraft(ps[0]);
      }
    }).catch(console.error);
  }, []);

  function selectPersona(id: string) {
    const p = personas.find((x) => x.id === id) ?? null;
    setActiveId(id);
    setDraft(p ?? {});
    setStep(1);
    setSaveError(null);
  }

  function startNew() {
    setActiveId(null);
    setDraft({});
    setStep(1);
    setSaveError(null);
  }

  function handleProfileNext(data: Partial<Persona>) {
    setDraft((prev) => ({ ...prev, ...data }));
    setStep(2);
  }

  // Called by KnowledgeBase "Build persona" — moves to review, persists new persona first if needed
  async function handleKnowledgeNext(notes: string, _docs: Document[]) {
    const updatedDraft = { ...draft, context_notes: notes };
    setDraft(updatedDraft);

    // For a brand-new persona (no activeId yet) we create it now so documents can be uploaded
    if (!activeId) {
      setSaving(true);
      setSaveError(null);
      try {
        const saved = await api.createPersona(updatedDraft);
        const updated = await api.getPersonas();
        setPersonas(updated);
        setActiveId(saved.id);
        setDraft(saved);
      } catch (e: unknown) {
        setSaveError(e instanceof Error ? e.message : "Save failed");
        setSaving(false);
        return;
      }
      setSaving(false);
    }

    setStep(3);
  }

  // Called by PersonaReview "Confirm & save"
  async function handleConfirm() {
    setSaving(true);
    setSaveError(null);
    try {
      if (activeId) {
        await api.updatePersona(activeId, draft);
      } else {
        await api.createPersona(draft);
      }
      const updated = await api.getPersonas();
      setPersonas(updated);
      router.push("/interview");
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <Sidebar
        personas={personas}
        activeId={activeId}
        onSelect={selectPersona}
        onNew={startNew}
      />
      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-xl">
          <StepIndicator currentStep={step} />
          {step === 1 && (
            <PersonaForm key={activeId ?? "new"} initial={draft} onNext={handleProfileNext} />
          )}
          {step === 2 && (
            <KnowledgeBase
              key={activeId ?? "new"}
              personaId={activeId}
              initial={draft}
              onBack={() => setStep(1)}
              onSave={handleKnowledgeNext}
              saving={saving}
              error={saveError}
            />
          )}
          {step === 3 && (
            <PersonaReview
              draft={draft}
              saving={saving}
              error={saveError}
              onEdit={setStep}
              onConfirm={handleConfirm}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
