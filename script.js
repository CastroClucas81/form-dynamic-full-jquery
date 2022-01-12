jQuery(function ($) {
  var table = $('.table')
  var formQuest = $('#formQuest')
  var valuesSelecteds = new Array()
  var count = 0

  formQuest.validate({
    rules: {
      first: {
        required: true
      },
      last: {
        required: true
      },
      email: {
        required: true,
        email: true
      }
    },
    messages: {
      first: {
        required: 'Esse campo não pode ser vazio'
      },
      last: {
        required: 'Esse campo não pode ser vazio'
      },
      email: {
        required: 'Esse campo não pode ser vazio',
        email: 'Insira um e-mail válido'
      }
    },
    submitHandler: function (form) {
      var data = []
      $('#formQuest :input[type=text], input[type=email]').each(function (i) {
        var input = $(this)
        var name = input.attr('name')
        data[name] = input.val()
      })
      formQuest.trigger('reset')
      $('#modalQuestion').modal('toggle')
      createRow(data)
    }
  })

  $('#inputSearch').on('keyup', function () {
    var value = $(this)
      .val()
      .toLowerCase()
    $('.table .lineTable').filter(function () {
      $(this).toggle(
        $(this)
          .text()
          .toLowerCase()
          .indexOf(value) > -1
      )
    })
  })

  $(document).on('click', '.deleteRow', function () {
    var deleteButton = $(this)

    alertify
      .confirm('Tem certeza que deseja excluir este usuário?', function () {
        deleteButton.closest('tr').remove()
        alertify.success('Deletado com sucesso!')
        updateCounterRows()
      })
      .set({ title: 'Atenção' })
      .set({ labels: { ok: 'Confirmar', cancel: 'Cancelar' } })
  })

  $(document).on('click', '#deleteSelecteds', function () {
    alertify
      .confirm('Tem certeza que deseja excluir estes usuários?', function () {
        for (let i in valuesSelecteds) {
          $('.selectedRow').each(function () {
            if ($(this).val() === valuesSelecteds[i]) {
              valuesSelecteds.splice(
                valuesSelecteds.indexOf(valuesSelecteds[i]),
                1
              )
              $(this)
                .closest('tr')
                .remove()

              removeButtonDeleteAll()
              updateCounterRows()
            }
          })
        }
        alertify.success('Deletados com sucesso!')
      })
      .set({ title: 'Atenção' })
      .set({ labels: { ok: 'Confirmar', cancel: 'Cancelar' } })
  })

  $(document).on('change', '.selectedRow', function () {
    if ($(this).is(':checked')) {
      valuesSelecteds.push($(this).val())
    } else {
      valuesSelecteds.splice(valuesSelecteds.indexOf($(this).val()), 1)
    }

    removeButtonDeleteAll()
  })

  function createRow (data) {
    var countRow = $('.counter').before().length + 1

    if (countRow <= 2) {
      table.append(
        `
             <tr class="lineTable">
                  <th><input type="checkbox" value="${countRow}" class="selectedRow" name="selectedRow" /></th>
                  <th class="counter"></th>
                  <td>${data.first}</td>
                  <td>${data.last}</td>
                  <td>${data.email}</td>
                  <td><button type="button" class="btn btn-outline-info btn-sm editRow">Edit</button></td>
                  <td><button type="button" class="btn btn-outline-danger btn-sm deleteRow">Excluir</button></td>
             </tr>
          `
      )

      var notification = alertify.notify(
        'Usuário criado com sucesso',
        'success',
        5
      )
    } else {
      alertify
        .alert('Não é possível criar mais de 3 usuários!')
        .set({ title: 'Atenção' })
    }

    updateCounterRows()
  }

  $('.editRow').on('click', function() {

  });

  function removeButtonDeleteAll () {
    if (valuesSelecteds.length > 0) {
      $('#deleteSelecteds').remove()
      $('.card-header').prepend(
        `
          <button class="btn btn-danger" id="deleteSelecteds">Deletar x${valuesSelecteds.length}</button>
          `
      )
    } else {
      $('#deleteSelecteds').remove()
    }
  }

  function updateCounterRows () {
    var countRow = $('.counter').before().length
    $('.counterRowsTable').html(`Contador: ${countRow}`)
  }

  updateCounterRows()

  function getAllUsers () {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/users',
      success: function (data) {
        console.log(data)

        for (let i in data) {
          createRow(data[i])
        }
      },
      error: function (data) {
        console.log('An error occurred.')
        console.log(data)
      }
    })
  }
})
