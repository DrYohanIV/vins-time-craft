import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/messages")({ component: AdminMessages });

function AdminMessages() {
  const qc = useQueryClient();
  const { data: messages } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => (await supabase.from("messages").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const toggleRead = async (id: string, is_read: boolean) => {
    const { error } = await supabase.from("messages").update({ is_read: !is_read }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-messages"] });
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-messages"] });
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-4">Messages</h2>
      {!messages?.length ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">No messages yet.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`glass rounded-2xl p-5 ${!m.is_read ? "border-[var(--color-gold)]/40" : ""}`}>
              <div className="flex justify-between gap-3 mb-2">
                <div>
                  <div className="font-display text-lg">{m.name} {!m.is_read && <span className="text-xs text-[var(--color-gold)] uppercase ml-2">new</span>}</div>
                  <div className="text-xs text-muted-foreground">{m.email}{m.phone && ` · ${m.phone}`} · {new Date(m.created_at).toLocaleString()}</div>
                  {m.subject && <div className="text-sm mt-1 text-[var(--color-gold-soft)]">{m.subject}</div>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => toggleRead(m.id, m.is_read)} className="p-2 hover:text-[var(--color-gold)]" title={m.is_read ? "Mark unread" : "Mark read"}>
                    {m.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </button>
                  <button onClick={() => remove(m.id)} className="p-2 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap border-t border-[var(--color-border)] pt-3">{m.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
