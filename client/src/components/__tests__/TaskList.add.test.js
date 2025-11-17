import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from '../TaskList.vue'

describe('TaskList - ajout tâche', () => {
  it('rafraîchit la liste après un POST réussi', async () => {
    let fetchCalls = 0
    global.fetch = vi.fn()
      .mockImplementationOnce(() => Promise.resolve({ // premier appel = GET au mount
        ok: true,
        json: () => Promise.resolve([])
      }))
      .mockImplementationOnce(() => { // deuxième appel = POST depuis App
        fetchCalls++
        return Promise.resolve({ ok: true })
      })
      .mockImplementationOnce(() => { // troisième appel = GET après ajout
        fetchCalls++
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ id: 999, title: 'Nouvelle depuis test', completed: false }])
        })
      })

    const wrapper = mount(TaskList)
    await wrapper.vm.fetchTasks()  // simule le refresh depuis App.vue

    expect(fetchCalls).toBe(2)
    expect(wrapper.text()).toContain('Nouvelle depuis test')
  })
})