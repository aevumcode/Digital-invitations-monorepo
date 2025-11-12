// components/settings/BillingTab.tsx
"use client";

import { Download, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type BillingSummary = {
  planName: string; // npr. "Pro"
  price: string; // npr. "$29/mj"
  nextBillingAt: string; // ISO
  status: "active" | "past_due" | "canceled";
};

type Invoice = { id: string; dateISO: string; title: string; amount: string; downloadUrl?: string };

type PaymentMethod = {
  brand: string; // "Visa"
  last4: string; // "4242"
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

type Props = {
  userId: number;
  summary: BillingSummary;
  invoices: Invoice[];
  paymentMethod: PaymentMethod | null;
};

export default function BillingTab({ summary, invoices, paymentMethod }: Props) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Naplata i pretplata</CardTitle>
        <CardDescription>Upravljajte pretplatom i podacima za naplatu.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Trenutni plan</h3>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-lg">
                {summary.planName} • {summary.price}
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {summary.status === "active" ? "Aktivan" : summary.status}
              </Badge>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Sljedeća naplata: {new Date(summary.nextBillingAt).toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Promijeni plan
              </Button>
              <Button variant="outline" size="sm">
                Otkaži pretplatu
              </Button>
            </div>
          </div>
        </div>

        {/* Kartica */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Način plaćanja</h3>
          <div className="p-4 border border-gray-200 rounded-lg">
            {paymentMethod ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div className="font-medium">
                    {paymentMethod.brand} •••• {paymentMethod.last4}
                  </div>
                  {paymentMethod.isDefault && <Badge variant="secondary">Zadano</Badge>}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Istječe {String(paymentMethod.expMonth).padStart(2, "0")}/{paymentMethod.expYear}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ažuriraj karticu
                  </Button>
                  <Button variant="outline" size="sm">
                    Dodaj metodu plaćanja
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-600">Nema spremljenih metoda plaćanja.</div>
            )}
          </div>
        </div>

        {/* Računi */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Povijest naplate</h3>
          <div className="space-y-2">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <div className="font-medium">{new Date(inv.dateISO).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-600">{inv.title}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{inv.amount}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={inv.downloadUrl ?? "#"} target="_blank" rel="noreferrer">
                      <Download className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
            {!invoices.length && <div className="text-sm text-gray-600">Još nema računa.</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
