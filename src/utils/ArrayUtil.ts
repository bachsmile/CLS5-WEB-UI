export default class ArraysUtil {
  static flatMapTree = (data: Array<any>, propertyFlat: string) => {
    return data.flatMap(obj => {
      const arrayMap = [obj]
      if (obj[propertyFlat]) {
        const perIds = ArraysUtil.flatMapTree(obj[propertyFlat], propertyFlat)

        arrayMap.push(...perIds)
      }

      return arrayMap
    })
  }

  static unFlatMapTree = (list: any) => {
    return list.flatMap((element: any) => {
      if (!element.children) {
        // Nếu phần tử không có children, trả về nó như là một phần tử của danh sách mới
        return [element]
      }

      // Nếu phần tử có children, đệ quy vào từng phần tử con và đưa chúng vào danh sách mới
      return [element, ...ArraysUtil.unFlatMapTree(element.children)]
    })
  }

  /**
   *
   * @param data
   * @returns
   */
  static formatTreeData = (data: Array<any>, root: any, t: any, customKey = 'permissions') => {
    return data.reduce((object, permiss) => {
      const { permissions, children, ...rest } = permiss // loại bỏ permissions ra khỏi object

      const perId = permiss.orgId ? permiss.orgId : permiss.id
      object[`node-${perId}`] = rest
      object[`node-${perId}`].ids = permiss.id
      object[`node-${perId}`].text = t(object[`node-${perId}`].name)

      object[`node-${perId}`].permission = permiss.permissionValue
      object[`node-${perId}`].orgPermission = permiss.orgPermissionValue
      object[`node-${perId}`].permissionValue = permiss.permission ? permiss.permission : 0
      object[`node-${perId}`].orgPermissionValue = permiss.orgPermission ? permiss.orgPermission : 0
      object[`node-${perId}`].state = {
        ...permiss.state,
      }
      if (root.includes(`node-${perId}`)) {
        object[`node-${perId}`].state = {
          opened: true,
          ...permiss.state,
        }
      }

      if (permiss[customKey]?.length)
        object[`node-${perId}`].children = permiss[customKey]?.map((item: any) => `node-${item.orgId ? item.orgId : item.id}`)
      return object
    }, {})
  }

  // static formatTreeMaxSpeed = (data: any) => {
  //   const obj = {}
  //   if (data.permissions && data.permissions.length > 0 && data.id) {
  //     data.permissions.forEach((item: any) => {
  //       if (item.id)
  //         ArraysUtil.formatTreeMaxSpeed(item)
  //     })
  //   }
  // }

  static TestTree = (data: any, listPermission: Array<any>) => {
    if (data.permissions && data.permissions.length > 0 && data.id) {
      data.permissions.forEach((item: any) => {
        if (item.id)
          ArraysUtil.TestTree(item, listPermission)
      })
    }

    if (data.id && data.permissions.length > 0) {
      const mapPermission = listPermission.find(x => x.featureId === Number(data.orgId))
      if (mapPermission) {
        data.permission = mapPermission.permissionValue
        data.orgPermission = mapPermission.permissionOrganizationalStructure
        data.permissions.forEach((x: any) => {
          if (!x.id && (mapPermission.permissionValue & x.permissionValue) > 0)
            x.state = { checked: true }
          if (!x.id && (mapPermission.permissionOrganizationalStructure & x.orgPermissionValue) > 0)
            x.orgPermission = mapPermission.permissionOrganizationalStructure
        })
      }
      const childrenPermission = data.permissions.filter((x: any) => x.state && (x.state.indeterminate || x.state.checked)).length
      if (childrenPermission > 0)
        data.state = { indeterminate: true }

      const def = data.permissions.filter((x: any) => x.state && x.state.checked).length
      if (def === data.permissions.length)
        data.state = { checked: true }
    }
  }

  // Hàm lấy độ sâu của 1 node (root có depth = 0)
  static getDepthNode = (originalArray, node, map, count = 0) => {
    if (
      node.parentId === null
    || node.parentId === undefined
    || map[node.parentId] === undefined
    || !originalArray[map[node.parentId]]
    || node.parentId === 0
    || node.parentId === node.id
    )
      return count

    count += 1

    return ArraysUtil.getDepthNode(originalArray, originalArray[map[node.parentId]], map, count)
  }

  // Hàm chuyển đổi dữ liệu từ list sang tree
  // Params:
  //    - Array: mảng dữ liệu truyền vào
  //    - Id: tên thuộc tính định danh của mỗi node, mặc định là id
  //    - ParentId: tên thuộc tính của id parent của mỗi phần tử, mặc định là parentId, phần tử gốc thì thuộc tính parentId có giá trị bằng 0
  //    - Children: tên thuộc tính chứa các node con của node hiện tại, mặc định là children
  static fromListToTree = (originalArray, id = 'id', parentId = 'parentId', children = 'children', depth = null, rootParentId = 0) => {
  // Clone mảng ban đầu để tránh mutate dữ liệu (immutable function)
    const array = JSON.parse(JSON.stringify(originalArray))
    const map: any = {}
    let node
    const tree = []
    let i

    // Tạo map object để tìm kiếm nhanh index phần tử trong mảng dựa theo ID, ==> độ phức tạp O(1)
    for (i = 0; i < array.length; i += 1)
      map[array[i][id]] = i

    // Lặp qua từng node, nếu parentId = rootParentId thì push vào tree, nếu parentId != rootParentId thì push vào children của node cha
    for (i = 0; i < array.length; i += 1) {
      node = array[i]
      if (node[parentId] !== rootParentId) {
        if (!depth || ArraysUtil.getDepthNode(array, node, map) <= depth) {
          if (array[map[node[parentId]]] && !array[map[node[parentId]]][children])
            array[map[node[parentId]]][children] = [node]

          else if (array[map[node[parentId]]] && array[map[node[parentId]]][children])
            array[map[node[parentId]]][children].push(node)
        }
      }
      else {
        tree.push(node)
      }
    }

    return tree
  }

  // Hàm tìm kiếm tất cả các children của tree node,
  // Input: mảng các tree node, id của node
  // Output: mảng các tree id
  // Params:
  //    - Array: cấu trúc mảng truyền vào có parentId
  //    - Id: tên thuộc tính định danh của mỗi node, mặc định là id
  //    - ParentId: id cha của các node
  static getAllChildrenOfTreeNode = (originalArray: Array<any>, nodeId: any) => {
    let result = []
    let i
    for (i = 0; i < originalArray.length; i += 1) {
      if (originalArray[i].parentId === nodeId) {
        result.push(originalArray[i].id)

        const children: any = ArraysUtil.getAllChildrenOfTreeNode(originalArray, originalArray[i].id)

        result = result.concat(children)
      }
    }

    return result
  }

  static sliceArray = (array: Array<any>, startIndex?: number, endIndex?: number) => {
    return window._.slice(array, startIndex, endIndex)
  }

  static checkParentNode = (parent: any, objChild: any, obj: any, key: string) => {
    if (parent.parent) {
      objChild.parent.parent = { [key]: parent.parent[key] }
      obj.level++
      ArraysUtil.checkParentNode(parent.parent, objChild.parent, obj, key)
    }
  }

  /**
   * @name: Định dạng cấu trúc cây cho table-tree
   * @param {Array<any>} items => Mảng phẳng dữ liệu cần định dạng
   * @param {string} key => key quy định id node cha
   * @return {object}
   */
  static formatTreeTable = (items: Array<any>, key: string) => {
    const result: any = []

    window._.transform(items, (acc, obj: any) => {
      const parent = acc.find((item: any) => item.children && item.children.find((child: any) => child[key] === obj[key]))

      obj.level = 0
      if (parent) {
        obj.parent = { [key]: parent[key] }
        obj.level++
        ArraysUtil.checkParentNode(parent, obj, obj, key)
      }
      acc.push(obj)

      return acc
    }, result)

    return result
  }

  /**
   * @name: Định dạng cấu trúc cây cho v-select-tree sẽ trả về dạng từ mảng phẳng có parentId sang mảng cây có childrent và hủy cấu trúc phẳng
   * @param {Array<any>} items => Mảng phẳng dữ liệu cần định dạng
   * @param {string} keyParent => Keyword quy định id node cha
   * @param {string} customId =>  customId cho node
   * @return {object}
   */
  static formatSelectTree = (items: Array<any>, keyParent = 'parentId', customId = 'id') => {
    const orderedNodes = window._.orderBy(items, ['left'], ['desc'])
    const groupedNodes = window._.groupBy(orderedNodes, keyParent)
    return window._.map(groupedNodes['0'], parent => {
      const children = groupedNodes[parent[customId]] || []
      parent.children = children
      const dataChildren = ArraysUtil.mapChildToParent(parent, groupedNodes, customId)
      return dataChildren.length ? { ...parent, children: dataChildren } : { ...parent }
    })
  }

  static mapChildToParent = (parent: any, groupedNodes: any, customId: any) => {
    let dataChild = []
    dataChild = parent.children.map((item: any) => {
      if (groupedNodes[item[customId]]) {
        item = { ...item, children: groupedNodes[item[customId]] }
        const children = ArraysUtil.mapChildToParent(item, groupedNodes, customId)

        return { ...item, children }
      }

      return { ...item, children: groupedNodes[item[customId]] }
    })

    return dataChild
  }

  // 👉 IsEmptyArray
  static isEmptyArray = (arr: unknown): boolean => {
    return Array.isArray(arr) && arr.length === 0
  }
}

