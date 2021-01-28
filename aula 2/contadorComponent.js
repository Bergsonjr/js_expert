// IIFE -> Immediately Invoked Function Expression

(() => {
  const BTN_REINICIALIZAR = "btnReiniciar";
  const ID_CONTADOR = "contador";
  const PERIODO_INTERVALO = 10;
  const VALOR_CONTADOR = 100;

  class ContadorComponent {
    constructor() {
      this.initialize();
    }

    prepareCounterProxy() {
      const handler = {
        set: (currentContext, propertyKey, newValue) => {
          if (!currentContext.valor) {
            currentContext.stop();
          }
          currentContext[propertyKey] = newValue;
          return true;
        },
      };

      const counter = new Proxy(
        {
          valor: VALOR_CONTADOR,
          stop: () => {},
        },
        handler
      );

      return counter;
    }

    scheduleStop({ elementCounter, idInterval }) {
      return () => {
        clearInterval(idInterval);
        elementCounter.innerHTML = "";
        this.disableButton(false);
      };
    }

    // Parcial function
    updateText = ({ elementCounter, counter }) => () => {
      elementCounter.innerHTML = `Começando em <strong>${counter.valor--}</strong> segundos...`;
    };

    prepareButton(elementButton, startFn) {
      elementButton.addEventListener("click", startFn.bind(this));
      return (value = true) => {
        const attr = "disabled";

        if (value) {
          elementButton.setAttribute(attr, value);
          return;
        }

        elementButton.removeAttribute(attr);
      };
    }

    initialize() {
      console.log("initializing");

      const elementCounter = document.getElementById(ID_CONTADOR);
      const counter = this.prepareCounterProxy();

      const args = {
        elementCounter,
        counter,
      };

      const fn = this.updateText(args);
      const idInterval = setInterval(fn, PERIODO_INTERVALO);

      {
        const elementButton = document.getElementById(BTN_REINICIALIZAR);
        const disableButton = this.prepareButton(
          elementButton,
          this.initialize
        );

        disableButton();

        const args = { elementCounter, idInterval };
        // const disableButton = () => console.log("desabilitou");
        const stopCounterFn = this.scheduleStop.apply({ disableButton }, [
          args,
        ]);
        counter.stop = stopCounterFn;
      }
    }
  }

  window.ContadorComponent = ContadorComponent;
})();
