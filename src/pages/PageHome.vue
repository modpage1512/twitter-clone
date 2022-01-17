<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            v-model="newQweetContent"
            class="new-qweet"
            placeholder="Que piensas?"
            maxlength="280"
            bottom-slots
            counter
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="../../public/imagen1.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewQweet"
            :disable="!newQweetContent"
            class="q-mb-lg"
            color="primary"
            label="Qweet"
            rounded
            unelevated
            no-caps
          />
        </div>
      </div>

      <q-separator size="10px" color="grey-2" class="divider" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-item v-for="qweet in qweets" :key="qweet.id" class="q-py-md">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img src="../../public/imagen1.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1"
                ><strong>Carlos Castillo</strong>
                <span> @carlos_castillo</span>
                <br class="lt-md" />&bull; {{ dateP(qweet.date) }}
              </q-item-label>
              <q-item-label class="qweet-content text-body1">
                {{ qweet.content }}
              </q-item-label>
              <div class="row qweet-icons justify-between q-mt-sm">
                <q-btn
                  color="grey"
                  icon="far fa-comment"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  color="grey"
                  icon="fas fa-retweet"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  @click="toggleLiked(qweet)"
                  :color="qweet.liked ? 'pink' : 'gray'"
                  :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  @click="deleteQweet(qweet)"
                  color="grey"
                  icon="fas fa-trash"
                  size="sm"
                  flat
                  round
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { formatDistance } from "date-fns";
import db from "src/boot/firebase";

export default defineComponent({
  name: "PageHome",
  data() {
    return {
      newQweetContent: "",
      qweets: [],
    };
  },
  methods: {
    addNewQweet() {
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false,
      };
      db.collection("qweets")
        .add(newQweet)
        .then(function (docRef) {
          console.log("Document written with id: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
      this.newQweetContent = "";
    },
    deleteQweet(qweet) {
      db.collection("qweets")
        .doc(qweet.id)
        .delete()
        .then(function () {
          console.log("Documento Borrado exitosamente");
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    },
    dateP(value) {
      return formatDistance(value, new Date());
    },
    toggleLiked(qweet) {
      db.collection("qweets")
        .doc(qweet.id)
        .update({
          liked: !qweet.liked,
        })
        .then(function () {
          console.log("documento actualizado correctamente");
        })
        .catch(function (error) {
          console.error("Error updating document: ", error);
        });
    },
  },
  mounted() {
    db.collection("qweets").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let qweetChange = change.doc.data();
        qweetChange.id = change.doc.id;
        if (change.type === "added") {
          console.log("New qweet: ", qweetChange);
          this.qweets.unshift(qweetChange);
        }
        if (change.type === "modified") {
          console.log("Modified qweet: ", qweetChange);
          let index = this.qweets.findIndex(
            (qweet) => qweet.id === qweetChange.id
          );
          Object.assign(this.qweets[index], qweetChange);
        }
        if (change.type === "removed") {
          console.log("Removed qweet: ", qweetChange.id);
          let index = this.qweets.findIndex(
            (qweet) => qweet.id === qweetChange.id
          );
          this.qweets.splice(index, 1);
        }
      });
    });
  },
});
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important
    word-break: break-word
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qweet-content
  white-space: pre-line
.qweet-icons
  margin-left: -5px
</style>