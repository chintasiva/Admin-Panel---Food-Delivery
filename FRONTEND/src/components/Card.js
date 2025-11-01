export default function Card({ title, children }){
  return (
    <div className="bg-white dark:bg-[#0b1220] rounded-lg shadow-sm p-4">
      {title && <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-100">{title}</h3>}
      {children}
    </div>
  )
}
