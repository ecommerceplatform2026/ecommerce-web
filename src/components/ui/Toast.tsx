import hotToast from 'react-hot-toast'

type ToastType = 'success' | 'error'

export function Toast(message: string, type: ToastType = 'success') {
  const icon = type === 'success'
    ? <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    : <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />

  hotToast.custom(
    (t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} flex items-center gap-3 bg-background border border-border shadow-lg px-4 py-3 text-sm max-w-sm`}>
        <svg className={`h-5 w-5 shrink-0 ${type === 'success' ? 'text-green-500' : 'text-red-500'}`} viewBox="0 0 20 20" fill="currentColor">
          {icon}
        </svg>
        <span className="flex-1 text-foreground">{message}</span>
        <button onClick={() => hotToast.dismiss(t.id)} className="-mr-1 shrink-0 text-muted-foreground hover:text-foreground text-lg leading-none">&times;</button>
      </div>
    ),
    { duration: 3500 }
  )
}
