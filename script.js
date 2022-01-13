jQuery(function ($) {
  var formQuest = $("#formQuest");
  var valuesSelecteds = new Array();
  $("#selectAll").hide();

  formQuest.validate({
    rules: {
      first: {
        required: true,
      },
      last: {
        required: true,
      },
      email: {
        required: true,
        email: true,
      },
    },
    messages: {
      first: {
        required: "Esse campo não pode ser vazio",
      },
      last: {
        required: "Esse campo não pode ser vazio",
      },
      email: {
        required: "Esse campo não pode ser vazio",
        email: "Insira um e-mail válido",
      },
    },
    submitHandler: function (form) {
      let issetEmail = issetUser($("#email").val());
      if (issetEmail === true) {
        alertify.alert("Email já cadastrado.").set({ title: "Atenção" });
      } else {
        var data = [];
        $("#formQuest :input[type=text], input[type=email]").each(function (i) {
          var input = $(this);
          var name = input.attr("name");
          data[name] = input.val();
        });
        formQuest.trigger("reset");
        $("#modalUser").modal("toggle");
        createRow(data);
        showSelectAll();
      }
    },
  });

  $("#inputSearch").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $(".table .lineTable").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  $(document).on("click", ".deleteRow", function () {
    var deleteButton = $(this);

    alertify
      .confirm("Tem certeza que deseja excluir este usuário?", function () {
        deleteButton.closest("tr").remove();
        alertify.success("Deletado com sucesso!");
        updateCounterRows();
        showSelectAll();
      })
      .set({ title: "Atenção" })
      .set({ labels: { ok: "Confirmar", cancel: "Cancelar" } });
  });

  $(document).on("click", "#deleteSelecteds", function () {
    alertify
      .confirm("Tem certeza que deseja excluir estes usuários?", function () {
        for (let i in valuesSelecteds) {
          $(".selectedRow").each(function () {
            if ($(this).val() === valuesSelecteds[i]) {
              valuesSelecteds.splice(
                valuesSelecteds.indexOf(valuesSelecteds[i]),
                1
              );
              $(this).closest("tr").remove();

              removeButtonDeleteAll();
              updateCounterRows();
              showSelectAll();
            }
          });
        }
        alertify.success("Usuários deletados com sucesso!");
      })
      .set({ title: "Atenção" })
      .set({ labels: { ok: "Confirmar", cancel: "Cancelar" } });
  });

  $(document).on("change", ".selectedRow", function () {
    if ($(this).is(":checked")) {
      valuesSelecteds.push($(this).val());
    } else {
      valuesSelecteds.splice(valuesSelecteds.indexOf($(this).val()), 1);
    }

    removeButtonDeleteAll();
  });

  $(document).on("click", ".editRow", function () {
    let buttonClick = $(this);
    let baseColumn = $(this).closest(".lineTable");

    let firstInput = baseColumn.find('[class*="firstColumn"]');
    let lastInput = baseColumn.find('[class*="lastColumn"]');
    let emailInput = baseColumn.find('[class*="emailColumn"]');

    if (buttonClick.text() === "Editar") {
      buttonClick.text("Concluir");

      $(".editRow").each(function () {
        if ($(this).text() === "Editar") {
          $(this).prop("disabled", true);
        }
      });

      firstInput.html(
        `<input type="text" class="editFirst edit-input" name="editFirst" value="${firstInput.text()}">`
      );
      lastInput.html(
        `<input type="text" class="editLast edit-input" name="editLast" value="${lastInput.text()}">`
      );
      emailInput.html(
        `<input type="email" class="editEmail edit-input" name="editEmail" value="${emailInput.text()}">`
      );
    } else {
      if (
        $(".editFirst").val().length > 0 &&
        $(".editLast").val().length > 0 &&
        $(".editEmail").val().length > 0
      ) {
        buttonClick.text("Editar");

        $(".editRow").each(function () {
          if (buttonClick.text() === "Editar") {
            $(this).prop("disabled", false);
          }
        });

        firstInput.html(`${$(".editFirst").val()}`);
        lastInput.html(`${$(".editLast").val()}`);
        emailInput.html(`${$(".editEmail").val()}`);
      } else {
        alertify.error("Preencha todos os campos.");
      }
    }
  });

  $("#selectAll").on("change", function () {
    let check = $(this);

    if (check.is(":checked")) {
      $(".selectedRow").prop("checked", true);
      $(".selectedRow").each(function () {
        valuesSelecteds.push($(this).val());
      });
    } else {
      $(".selectedRow").prop("checked", false);
      $(".selectedRow").each(function () {
        valuesSelecteds.splice(valuesSelecteds.indexOf($(this).val()), 1);
      });
    }

    removeButtonDeleteAll();
  });

  function createRow(data) {
    var countRow = $(".counter").before().length + 1;

    if (countRow <= 3) {
      $(".table > tbody").append(
        `
             <tr class="lineTable">
                  <td><input type="checkbox" value="${countRow}" class="selectedRow" name="selectedRow" /></td>
                  <td class="counter"></td>
                  <td class="firstColumn">${data.first}</td>
                  <td class="lastColumn">${data.last}</td>
                  <td class="emailColumn">${data.email}</td>
                  <td width="90"><button type="button" class="editRow">Editar</button></td>
                  <td width="30"><button type="button" class="deleteRow"><i class="fas fa-trash"></i></button></td>
             </tr>
          `
      );

      var notification = alertify.notify(
        "Usuário criado com sucesso",
        "success",
        5
      );
    } else {
      alertify
        .alert("Não é possível criar mais de 3 usuários!")
        .set({ title: "Atenção" });
    }

    updateCounterRows();
  }

  function removeButtonDeleteAll() {
    if (valuesSelecteds.length > 0) {
      $("#deleteSelecteds").remove();
      $(".card-header-default").prepend(
        `
          <button class="button-danger-default" id="deleteSelecteds">Deletar x${valuesSelecteds.length}</button>
          `
      );
    } else {
      $("#selectAll").prop("checked", false);
      $("#deleteSelecteds").remove();
    }
  }

  function updateCounterRows() {
    var countRow = $(".counter").before().length;
    $(".counterRowsTable").html(`Número de linhas - ${countRow}`);
  }

  function showSelectAll() {
    if ($(`.lineTable`).length > 0) {
      $("#selectAll").show();
      return true;
    }
    $("#selectAll").hide();

    return false;
  }

  function issetUser(email) {
    let bool = false;

    if ($(`.emailColumn:contains(${email})`).length > 0) {
      bool = true;
    }

    return bool;
  }

  function getAllUsers() {
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/users",
      success: function (data) {
        console.log(data);

        for (let i in data) {
          createRow(data[i]);
        }
      },
      error: function (data) {
        console.log("An error occurred.");
        console.log(data);
      },
    });
  }

  updateCounterRows();
});
