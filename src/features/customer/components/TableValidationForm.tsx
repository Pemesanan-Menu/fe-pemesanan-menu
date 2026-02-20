import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

interface TableValidationFormProps {
  onValidate: (tableNumber: string) => Promise<void>
  isValidating: boolean
}

export function TableValidationForm({ onValidate, isValidating }: TableValidationFormProps): JSX.Element {
  const [tableNumber, setTableNumber] = useState('')

  const handleSubmit = () => {
    onValidate(tableNumber)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <img 
              src="/img/logo.webp" 
              alt="UMKM Kuliner Logo" 
              className="w-20 h-20 mx-auto mb-6 rounded-lg"
            />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Caffe Tetangga
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isValidating ? 'Memvalidasi...' : 'Masukkan nomor meja untuk melanjutkan'}
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="tableNumber">Nomor Meja</Label>
              <Input
                id="tableNumber"
                type="number"
                placeholder="Contoh: 5"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="mt-1.5"
                min="1"
              />
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={isValidating || !tableNumber.trim()}
              className="w-full"
            >
              {isValidating ? (
                <>
                  <Spinner size="sm" />
                  Memvalidasi...
                </>
              ) : (
                'Lanjutkan'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
