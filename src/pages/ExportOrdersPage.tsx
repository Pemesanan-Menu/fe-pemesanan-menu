import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportService } from '@/services/exportService'
import { toast } from 'sonner'
import { getErrorMessage } from '@/types/error'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function ExportOrdersPage(): JSX.Element {
  const [formatType, setFormatType] = useState<'csv' | 'pdf'>('csv')
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [status, setStatus] = useState('ALL')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!dateFrom || !dateTo) {
      toast.error('Tanggal mulai dan akhir harus diisi')
      return
    }

    setIsExporting(true)
    try {
      const from = format(dateFrom, 'yyyy-MM-dd')
      const to = format(dateTo, 'yyyy-MM-dd')
      const blob = await exportService.exportOrders(formatType, from, to, status === 'ALL' ? undefined : status)
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders_${from}_${to}.${formatType}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Export berhasil')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Export Laporan</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Export data pesanan dalam format CSV atau PDF
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-6">
              {/* Format Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Format File</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormatType('csv')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formatType === 'csv'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formatType === 'csv' ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'
                      }`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 dark:text-white">CSV</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Excel</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setFormatType('pdf')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formatType === 'pdf'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formatType === 'pdf' ? 'bg-red-500' : 'bg-gray-400 dark:bg-gray-600'
                      }`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 dark:text-white">PDF</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Print</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Periode Tanggal</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Dari</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal h-11 ${
                            !dateFrom && 'text-gray-500'
                          }`}
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {dateFrom ? format(dateFrom, 'd MMM yyyy', { locale: id }) : 'Pilih tanggal'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                          locale={id}
                          className="rounded-lg border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Sampai</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal h-11 ${
                            !dateTo && 'text-gray-500'
                          }`}
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {dateTo ? format(dateTo, 'd MMM yyyy', { locale: id }) : 'Pilih tanggal'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                          locale={id}
                          disabled={(date) => dateFrom ? date < dateFrom : false}
                          className="rounded-lg border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-3">
                <Label htmlFor="status" className="text-sm font-medium">Filter Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Status</SelectItem>
                    <SelectItem value="MENUNGGU">Menunggu</SelectItem>
                    <SelectItem value="DIPROSES">Diproses</SelectItem>
                    <SelectItem value="SELESAI">Selesai</SelectItem>
                    <SelectItem value="DIBAYAR">Dibayar</SelectItem>
                    <SelectItem value="DIBATALKAN">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengexport...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export {formatType.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Format CSV</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Excel Ready</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Format PDF</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Print Ready</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Proses Cepat</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Instant Download</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Informasi</h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Format CSV cocok untuk analisis data di Excel</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Format PDF cocok untuk laporan cetak</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Data mencakup detail pesanan dan total harga</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Pilih periode yang tidak terlalu panjang untuk hasil lebih cepat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export History Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tips Export
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <span className="shrink-0 w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-xs font-semibold text-purple-600 dark:text-purple-400">1</span>
                <span>Pilih format sesuai kebutuhan analisis Anda</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <span className="shrink-0h-5 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-xs font-semibold text-purple-600 dark:text-purple-400">2</span>
                <span>Tentukan rentang tanggal yang ingin diexport</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <span className="shrink-0 w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-xs font-semibold text-purple-600 dark:text-purple-400">3</span>
                <span>Filter status untuk data yang lebih spesifik</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <span className="shrink-0 w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-xs font-semibold text-purple-600 dark:text-purple-400">4</span>
                <span>Klik tombol export dan file akan terdownload otomatis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}
