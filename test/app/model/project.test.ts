import * as assert from 'assert'
import { Context } from 'egg'
import { app } from '../bootstrap'

describe('test/app/model/project.test.js', () => {
  let ctx: Context

  before(async () => {
    ctx = app.mockContext()
  })

  it('crud', async () => {
    const { Instance, Project } = ctx.model
    // 删除name为 ‘test’ 或 ’new test‘
    await Project.deleteMany({ name: { $in: ['test', 'new test'] } })
    await Instance.deleteMany({ name: { $in: ['test', 'new test'] } })

    const project = new ctx.model.Project()
    const instance = new ctx.model.Instance()

    project.name = 'test'
    project.description = 'test desc'

    instance.name = 'test'
    instance.description = 'test desc'

    project.instance_ids = [instance._id]

    // 创建
    await project.save()
    await instance.save()

    // 查询
    let findProject = await ctx.model.Project.findOne({ name: 'test' }).populate('instances')

    // 没有数据则有问题
    if (!findProject) return assert(false)
    if (!findProject.instances[0]) return assert(false)

    const json = JSON.stringify(findProject)

    // 修改name
    findProject.name = 'new test'
    await findProject.save()

    // 根据修改后的name查询
    findProject = await ctx.model.Project.findOne({ name: 'new test' })
    if (!findProject) return assert(false)

    // 删除name为 ‘test’ 或 ’new test‘
    await ctx.model.Project.deleteMany({ name: { $in: ['test', 'new test'] } })

    // 查询name为 ‘test’ 或 ’new test‘
    findProject = await ctx.model.Project.findOne({ name: { $in: ['test', 'new test'] } })

    assert(!findProject)
  })
})
