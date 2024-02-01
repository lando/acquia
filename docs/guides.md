---
description: Home helpful guides for the VitePress Default Theme Plus.
layout: page
title: Guides
sidebar: false
---

<script setup>
import {VPLCollectionPage, VPLCollectionPageTitle, VPLCollectionItems} from '@lando/vitepress-theme-default-plus';
import {useCollection} from '@lando/vitepress-theme-default-plus';

const {prev, pages} = useCollection('guide');

console.log(pages);

</script>

<VPLCollectionPage>
  <VPLCollectionPageTitle>
    <template #title>
      Guides
    </template>
    <template #lead>
      Helpful tutorial-like content!
    </template>
  </VPLCollectionPageTitle>
  <VPLCollectionItems :items="pages"/>
</VPLCollectionPage>
