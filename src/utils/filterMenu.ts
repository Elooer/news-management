const {
  role: { rights },
} = JSON.parse(localStorage.getItem('news_token') as string)

const filterMenu = (raw: any) => {
  const newData: any = []
  raw.forEach((item: any) => {
    let children: any = []
    if (item.pagepermisson === 1 && rights.includes(item.key)) {
      if (item.children?.length > 0) {
        item.children.forEach((item1: any) => {
          if (item1.pagepermisson === 1 && rights.includes(item1.key)) {
            children.push(item1)
          }
        })
        item.children = children
      } else {
        delete item.children
      }
      newData.push(item)
    }
  })
  return newData
}

export default filterMenu
