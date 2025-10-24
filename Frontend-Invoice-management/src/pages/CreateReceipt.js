"use client"

import { useState } from "react"
import { ReceiptForm } from "@/components/receiptAddition"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
    const [formData, setFormData] = useState(null)

    const handleFormData = (data) => {
        setFormData(data)
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Create Receipt</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReceiptForm onDataChange={handleFormData} />
                </CardContent>
            </Card>
        </div>
    )
}
