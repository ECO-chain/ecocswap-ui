<template>
  <div class="ecoc-connect-wallet">
    <templete v-show="stepper.currentStep === 1">
      <div class="main">
        <div class="title">
          <img class="logo" src="@/assets/logo-black.svg" alt="logo" />
          <div class="text">Please create or connect your wallet</div>
        </div>
        <div class="actions">
          <div class="btn btn-bg-puple shadow" @click="stepper.goto(2)">
            <div class="name">Connect ECOCWallet</div>
          </div>
          <div class="btn btn-text-puple shadow" @click="stepper.goto(3)">
            <div class="name">Create New ECOCWallet</div>
          </div>
        </div>
      </div>
    </templete>

    <!--Connect ECOC Wallet Page-->
    <templete v-show="stepper.currentStep === 2">
      <div class="connect-wallet">
        <div class="navbar">
          <img class="back" src="@/assets/img/back.png" alt="back" @click="stepper.goto(1)" />
        </div>
        <div class="title">
          <div class="text">Connect ECOC Wallet</div>
          <div class="description">Please upload your keystore file.</div>
        </div>
        <div class="keystore">
          <textarea
            class="input"
            v-model="connectWallet.keystore"
            placeholder="Keystore contents"
            readonly
          ></textarea>
          <div class="updoad">
            <a class="link">Choose your keystore file</a>
          </div>
        </div>
        <input
          class="textbox"
          type="password"
          placeholder="Password"
          v-model="connectWallet.password"
        />
        <div class="connect-wallet-actions">
          <div class="error-message" v-if="connectWallet.errorMsg">
            {{ connectWallet.errorMsg }}
          </div>
          <div class="btn btn-bg-puple" @click="connectWallet.onConnectWallet">
            <div class="name">Connect</div>
          </div>
        </div>
      </div>
    </templete>

    <!--Create ECOC Wallet Page-->
    <templete v-show="stepper.currentStep === 3">
      <div class="create-wallet">
        <div class="navbar">
          <img class="back" src="@/assets/img/back.png" alt="back" @click="stepper.goto(1)" />
        </div>
        <div class="title">
          <div class="text">Create ECOC Wallet</div>
          <div class="description">Please set your password to generate a keystore file</div>
        </div>

        <div class="content">
          <input
            class="textbox"
            type="password"
            placeholder="Input your password"
            v-model="createWallet.password"
          />
          <input
            class="textbox"
            type="password"
            placeholder=" Repeat your password"
            v-model="createWallet.confimedPassword"
          />
        </div>

        <div class="create-wallet-actions">
          <div class="error-message" v-if="createWallet.errorMsg">{{ createWallet.errorMsg }}</div>
          <div class="btn btn-bg-puple btn-right" @click="createWallet.onCreateNewWallet(stepper)">
            <div class="name" v-if="createWallet.isLoading">
              <easy-spinner size="20" type="circular" />
            </div>
            <div class="name" v-else>Create</div>
          </div>
        </div>
      </div>
    </templete>

    <!--Keystore Result Page-->
    <templete v-show="stepper.currentStep === 4">
      <div class="keystore-result">
        <div class="title">
          <div class="text">Keystore File Generated!</div>
          <div class="description">Please save your keystore file to connect your wallet.</div>
        </div>

        <div class="content">
          <div class="note">
            Note: Keep the keystore file in a safe and secure place. If you lose your keystore file
            or forgot password, it may cause losing your funds and will not be able to recover.
          </div>
          <div class="result">{{ createWallet.keystore }}</div>
        </div>

        <div class="keystore-result-actions">
          <div class="btn btn-bg-puple">
            <div class="name">Download keystore file</div>
          </div>
          <div class="connect mt-8">
            Already saved your keystore file?.
            <a class="link" @click="stepper.goto(2)">Connect</a>
          </div>
        </div>
      </div>
    </templete>
  </div>
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component'
import { ref, computed } from 'vue'
import useStepper from '@/components/composables/use-stepper'
import useEcocWallet from '@/components/composables/use-ecoc-wallet'

@Options({
  components: {},
})
export default class EcocConnectWallet extends Vue {
  minPasswordLength = 8

  stepper = setup(() => {
    const { currentStep, goto } = useStepper(4)

    return {
      currentStep,
      goto,
    }
  })

  connectWallet = setup(() => {
    const { state, connect } = useEcocWallet()
    const keystore = ref('')
    const password = ref('')
    const errorMsg = ref('')

    const isValid = computed(
      () => keystore.value.length > 0 && password.value.length >= this.minPasswordLength
    )

    const onConnectWallet = () => {
      errorMsg.value = ''

      if (isValid.value) {
        connect({ keystore: keystore.value, password: password.value })
          .then(() => {
            errorMsg.value = ''
            console.log(state.address)
          })
          .catch((error) => {
            errorMsg.value = error
          })
      } else {
        errorMsg.value = 'Wrong Password'
      }
    }

    return {
      keystore,
      password,
      errorMsg,
      onConnectWallet,
    }
  })

  createWallet = setup(() => {
    const { createWallet } = useEcocWallet()
    const isLoading = ref(false)
    const keystore = ref('')
    const password = ref('')
    const confimedPassword = ref('')
    const errorMsg = ref('')

    const isValid = computed(
      () =>
        password.value.length >= this.minPasswordLength && password.value === confimedPassword.value
    )

    const onError = (msg: string) => {
      errorMsg.value = msg
      isLoading.value = false
    }

    const onCreateNewWallet = (stepper: any) => {
      if (isLoading.value === true) {
        return
      }

      isLoading.value = true
      errorMsg.value = ''

      if (isValid.value) {
        createWallet({ password: password.value })
          .then((result) => {
            errorMsg.value = ''

            setTimeout(() => {
              keystore.value = result
              isLoading.value = false
              stepper.goto(4)
            }, 1500)
          })
          .catch((error) => {
            onError(error)
          })
      } else {
        onError('Invalid Password')
      }
    }

    return {
      isLoading: computed(() => isLoading.value),
      keystore,
      password,
      confimedPassword,
      errorMsg,
      onCreateNewWallet,
    }
  })
}
</script>

<style scoped lang="scss">
textarea {
  resize: none;
  background: #f5f5f5 0% 0% no-repeat padding-box;
  border-radius: 16px;
  border: 0px solid rgba(105, 28, 128, 1);
}

input {
  height: 52px;
  background: #f5f5f5 0% 0% no-repeat padding-box;
  border-radius: 16px;
}

input:focus {
  border: 1px solid rgba(105, 28, 128, 0.5);
}

.ecoc-connect-wallet {
  top: 0;
  left: 0;
  position: relative;
}

.main {
  margin: auto;
  .title {
    .logo {
      height: 45px;
      width: 135px;
    }
    .text {
      color: #929292;
      opacity: 0.66;
    }
    padding: 80px 0px;
  }

  .actions .btn {
    margin: 20px 0px;
  }
}

.connect-wallet {
  .title {
    position: left;
    .text {
      font-weight: bold;
      color: #691c80;
      opacity: 1;
    }

    .description {
      font-size: 14px;
      opacity: 0.4;
    }
  }

  .keystore {
    margin-top: 30px;
    margin-bottom: 30px;
    text-align: right;
    .input {
      min-height: 150px;
    }

    .upload {
      font-size: 14px;
    }
  }

  .connect-wallet-actions {
    .btn {
      margin: 20px 0px;
    }
  }
}

.create-wallet {
  margin: auto;

  .content {
    margin-top: 40px;
    .textbox {
      margin: 5px 0px;
    }
  }

  .create-wallet-actions {
    margin-top: 20px;
    .btn {
      margin: 20px 0px;
    }
  }
}

.keystore-result {
  margin: auto;

  .content {
    margin: 20px 0px;
    .note {
      background-color: #fffce9;
      color: #ffb74d;
      font-size: 13px;
      padding: 10px;
      border: 1px solid #ffb74d;
      border-radius: 10px;
    }

    .result {
      display: flex;
      justify-content: center;
      flex-direction: column;
      overflow: auto;
      word-wrap: break-word;
      min-height: 120px;
      margin-top: 15px;
      background: #f6f6f6 0% 0% no-repeat padding-box;
      border-radius: 16px;
      font-size: 13px;
      top: 50%;

      padding: 14px;
    }
  }

  .keystore-result-actions {
    padding: 0px 0px;
  }
}

.link {
  color: #691c80;
  cursor: pointer;
  text-decoration: underline;
}

.navbar {
  display: flex;
  position: left;
  .back {
    cursor: pointer;
    width: 27px;
    height: 27px;
  }
}
</style>
