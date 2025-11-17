import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from '../TaskList.vue'

describe('TaskList.vue', () => {
  it('affiche les tâches récupérées via fetch', async () => {
    // Mock global fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, title: 'Apprendre Vitest', completed: false },
          { id: 2, title: 'Faire les courses', completed: true },
        ]),
      } as Response)
    )

    const wrapper = mount(TaskList)

    // Attend que fetch soit appelé et que le DOM soit mis à jour
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/tasks')
    expect(wrapper.text()).toContain('Apprendre Vitest')
    expect(wrapper.text()).toContain('Faire les courses')
    expect(wrapper.findAll('li')).toHaveLength(2)
  })

  it('affiche "Aucune tâche" quand la liste est vide', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response)
    )

    const wrapper = mount(TaskList)
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.text()).toContain('Aucune tâche pour le moment')
  })
})