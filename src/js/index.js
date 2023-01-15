$(document).ready(function () {
  const maxDistanceForScroll = 1600;

  const slider = tns({
    container: ".carousel__inner",
    items: 1,
    slideBy: "page",
    autoplay: false,
    nav: false,
    controls: false,

    responsive: {
      360: {
        nav: true,
      },

      992: {
        nav: false,
      },
    },
  });

  const prev = document.querySelector(".prev");
  prev.addEventListener("click", () => {
    slider.goTo("prev");
  });

  const next = document.querySelector(".next");
  next.addEventListener("click", () => {
    slider.goTo("next");
  });

  function validateForm(form) {
    $(form).validate({
      rules: {
        name: "required",
        phone: "required",

        email: {
          required: true,
          email: true,
        },
      },

      messages: {
        name: "Пожалуйста, введите ваше имя",
        phone: "Пожалуйста, введите свой номер телефона",

        email: {
          required: "Пожалуйста, введите вашу почту",
          email: "Неправильно введен адрес почты",
        },
      },
    });
  }

  function toggleSlide(item) {
    $(item).each(function (i) {
      $(this).on("click", function (e) {
        e.preventDefault();
        $(".catalog-item__content")
          .eq(i)
          .toggleClass("catalog-item__content_active");
        $(".catalog-item__list").eq(i).toggleClass("catalog-item__list_active");
      });
    });
  }

  $("ul.catalog__tabs").each(function (i) {
    const storage = localStorage.getItem("div.catalog__content_active" + i);
    if (storage) {
      $(this)
        .find("li")
        .removeClass("catalog__tab_active")
        .eq(storage)
        .addClass("catalog__tab_active")
        .closest("div.container")
        .find("div.catalog__content")
        .removeClass("catalog__content_active")
        .eq(storage)
        .addClass("catalog__content_active");
    }
  });

  $("ul.catalog__tabs").on(
    "click",
    "li:not(.catalog__tab_active)",
    function () {
      $(this)
        .addClass("catalog__tab_active")
        .siblings()
        .removeClass("catalog__tab_active")
        .closest("div.container")
        .find("div.catalog__content")
        .removeClass("catalog__content_active")
        .eq($(this).index())
        .addClass("catalog__content_active");

      const ulIndex = $("ul.catalog__tabs").index(
        $(this).parents("ul.catalog__tabs")
      );
      localStorage.removeItem("div.catalog__content_active" + ulIndex);
      localStorage.setItem(
        "div.catalog__content_active" + ulIndex,
        $(this).index()
      );
    }
  );

  $("ul.catalog__tabs").on(
    "click",
    "li:not(.catalog__tab_active)",
    function () {
      $(this)
        .addClass("catalog__tab_active")
        .siblings()
        .removeClass("catalog__tab_active");
    }
  );

  toggleSlide(".catalog-item__link");
  toggleSlide(".catalog-item__back");

  $("[data-modal=consultation]").on("click", function () {
    $(".overlay, #consultation").fadeIn();
  });

  $(".modal__close").on("click", function () {
    $(".overlay, #consultation, #order, #thanks").fadeOut();
  });

  $(".button_mini").each(function (i) {
    $(this).on("click", function () {
      $("#order .modal__descr").text($(".catalog-item__subtitle").eq(i).text());
      $(".overlay, #order").fadeIn();
    });
  });

  validateForm("#consultation-form");
  validateForm("#consultation form");
  validateForm("#order form");

  $("input[name=phone]").mask("+7 (999) 999-99-99");

  // $("input[name=name]").on("blur", function () {
  //     if ($(this).val().match("^[a-zA-Z]{3,16}$")) {
  //         alert("Valid name");
  //     } else {
  //         alert("That's not a name");
  //     }
  // });

  $("form").submit(function (e) {
    e.preventDefault();

    if (!$(this).valid()) return;

    $.ajax({
      type: "POST",
      url: "mailer/smart.php",
      data: $(this).serialize(),
    }).done(function () {
      $(this).find("input").val("");

      $("form").trigger("reset");
    });

    return false;
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() > maxDistanceForScroll) $(".pageup").fadeIn();
    else $(".pageup").fadeOut();
  });

  $("a[href='#up']").click(function () {
    const href = $(this).attr("href");
    $("html, body").animate({ scrollTop: $(href).offset().top + "px" });
    return false;
  });

  new WOW().init();
});
