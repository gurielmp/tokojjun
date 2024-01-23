import prismadb from "@/lib/prismadb"

interface DashboardPageProps {
  params: { storeid: string }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeid,
    },
  })
  return (
    <>
      <div>Active store : {store?.name}</div>
    </>
  )
}

export default DashboardPage
