import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { Trophy, FileUp, ShieldAlert, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { submitProofAction } from "@/app/actions/winners"
import { PageHeader } from "@/components/layout/page-header"

export default async function UserWinningsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: winnings, error } = await supabase
    .from("winners")
    .select("*, draws(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (
    <div className="space-y-10 pb-12">
      <PageHeader
        title="Your Winnings"
        description="Manage your prize claims and verification documents."
      />

      {winnings.length === 0 ? (
        <Card className="flex flex-col items-center justify-center bg-card/5 p-10 shadow-none">
          <Trophy className="mb-4 h-12 w-12 text-muted-foreground opacity-20" />
          <p className="text-lg font-bold text-muted-foreground">
            No winnings recorded yet
          </p>
          <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
            Submit your golf scores regularly to increase your chances in the
            next draw!
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {winnings.map((win) => (
            <Card
              key={win.id}
              className="overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <span className="font-black tracking-tight uppercase">
                        {format(new Date(win.draws?.draw_month), "MMMM yyyy")}{" "}
                        Draw
                      </span>
                    </div>
                    <Badge
                      className={cn(
                        "text-[10px] tracking-widest uppercase",
                        win.verification_status === "approved"
                          ? "border-green-500/20 bg-green-500/10 text-green-500"
                          : win.verification_status === "rejected"
                            ? "border-rose-500/20 bg-rose-500/10 text-rose-500"
                            : "border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
                      )}
                      variant="outline"
                    >
                      {win.verification_status}
                    </Badge>
                  </div>

                  <div className="mb-6 flex items-baseline gap-2">
                    <span className="text-4xl font-black">
                      £{Number(win.prize_amount).toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      {win.tier.replace("_", " ")}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <p className="text-muted-foreground">Payout Status:</p>
                      <Badge variant="secondary" className="capitalize">
                        {win.payout_status}
                      </Badge>
                    </div>

                    {win.verification_status === "rejected" && (
                      <div className="flex items-start gap-3 rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
                        <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500" />
                        <div>
                          <p className="text-sm font-bold tracking-tighter text-rose-500 uppercase">
                            Rejection Reason
                          </p>
                          <p className="text-sm text-rose-500/80">
                            {win.rejection_reason ||
                              "No reason provided. Please contact support."}
                          </p>
                        </div>
                      </div>
                    )}

                    {win.verification_status === "approved" && (
                      <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <p className="text-sm font-medium text-green-500">
                          Your score has been verified. Payout is being
                          processed.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Section */}
                <div className="flex flex-col justify-center border-l border-border/50 bg-muted/30 p-6 md:w-80">
                  {(win.verification_status === "pending" ||
                    win.verification_status === "rejected") &&
                  !win.proof_url ? (
                    <div className="space-y-4">
                      <div className="mb-4 flex flex-col items-center gap-2 text-center">
                        <FileUp className="h-8 w-8 text-primary opacity-40" />
                        <p className="text-sm font-bold uppercase">
                          Submit Proof
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Upload your Stableford scorecard (JPG, PNG, or PDF).
                        </p>
                      </div>

                      <form
                        action={async (formData) => {
                          "use server"
                          await submitProofAction(win.id, formData)
                        }}
                      >
                        <input
                          type="file"
                          name="file"
                          className="w-full text-xs file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-primary/90"
                          required
                          accept=".jpg,.jpeg,.png,.pdf"
                        />
                        <Button
                          type="submit"
                          className="mt-4 h-9 w-full text-xs font-bold tracking-widest uppercase"
                        >
                          Upload Scorecard
                        </Button>
                      </form>
                    </div>
                  ) : win.proof_url ? (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm font-bold tracking-tighter uppercase">
                        Proof Submitted
                      </p>
                      <a
                        href={win.proof_url}
                        target="_blank"
                        className="text-xs font-medium text-primary underline hover:text-primary/80"
                      >
                        View your document
                      </a>
                      {win.verification_status !== "approved" && (
                        <p className="mt-2 px-4 text-[10px] text-muted-foreground italic">
                          Our team is currently reviewing your document.
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
