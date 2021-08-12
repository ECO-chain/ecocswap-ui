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
          <div class="btn btn-text-puple shadow btn-left" @click="stepper.goto(1)">
            <div class="name">Back</div>
          </div>
          <div class="btn btn-bg-puple shadow btn-right">
            <div class="name">Connect</div>
          </div>
        </div>
      </div>
    </templete>

    <!--Create ECOC Wallet Page-->
    <templete v-show="stepper.currentStep === 3">
      <div class="create-wallet">
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
          <div class="btn btn-text-puple shadow btn-left" @click="stepper.goto(1)">
            <div class="name">Back</div>
          </div>
          <div class="btn btn-bg-puple shadow btn-right" @click="stepper.goto(4)">
            <div class="name">Connect</div>
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
          <div class="btn btn-bg-puple shadow">
            <div class="name">Download keystore file</div>
          </div>
          <div class="connect">
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
import useStepper from '@/components/composables/use-stepper'

@Options({
  components: {},
})
export default class EcocConnectWallet extends Vue {
  connectWallet = {
    keystore: '',
    password: '',
  }

  createWallet = {
    keystore: 'example keystore contents',
    password: '',
    confimedPassword: '',
  }

  stepper = setup(() => {
    const { currentStep, totalStep, goto, next, prev } = useStepper(4)

    return {
      currentStep,
      totalStep,
      goto,
      next,
      prev,
    }
  })
}
</script>

<style scoped lang="scss">
textarea {
  resize: none;
  background: #f8f4ff 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 3px 6px #00000029;
  border-radius: 16px;
}

input {
  height: 52px;
  background: #f8f4ff 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 3px 6px #00000029;
  border-radius: 16px;
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
    padding: 100px 0px;
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
    display: flex;
    .btn {
      width: 50%;
      margin: 20px 0px;

      &-left {
        margin-right: 10px;
      }
      &-right {
        margin-left: 10px;
      }
    }
  }
}

.create-wallet {
  margin: auto;

  .content {
    margin-top: 30px;
    .textbox {
      margin: 5px 0px;
    }
  }

  .create-wallet-actions {
    margin-top: 30px;
    display: flex;
    .btn {
      width: 50%;
      margin: 20px 0px;

      &-left {
        margin-right: 10px;
      }
      &-right {
        margin-left: 10px;
      }
    }
  }
}

.keystore-result {
  margin: auto;

  .content {
    margin: 30px 0px;
    .note {
      background: rgba(255, 183, 77, 0.2);
      color: #ffb74d;
      font-size: 13px;

      padding: 10px;
      border-width: 1em;
      border-color: #ffb74d;
      border-radius: 10px;
    }

    .result {
      min-height: 150px;
      margin-top: 15px;
      background: rgba(128, 128, 128, 0.2);
      font-size: 13px;

      padding: 10px;
      border-radius: 10px;
    }
  }
}

.link {
  color: #691c80;
  cursor: pointer;
  text-decoration: underline;
}
</style>
