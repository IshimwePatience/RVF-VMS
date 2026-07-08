--
-- PostgreSQL database dump
--

\restrict s9hYKBHXXt3rsLFMpKTVJveXdIZP11JjGIv7Y5tD5viifo2vDPYPRTt6XVXea0N

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP EVENT TRIGGER IF EXISTS pgrst_drop_watch;
DROP EVENT TRIGGER IF EXISTS pgrst_ddl_watch;
DROP EVENT TRIGGER IF EXISTS issue_pg_net_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_graphql_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_cron_access;
DROP EVENT TRIGGER IF EXISTS issue_graphql_placeholder;
DROP PUBLICATION IF EXISTS supabase_realtime;
ALTER TABLE IF EXISTS ONLY storage.vector_indexes DROP CONSTRAINT IF EXISTS vector_indexes_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_upload_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY public."WatchProgresses" DROP CONSTRAINT IF EXISTS "WatchProgresses_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."WatchProgresses" DROP CONSTRAINT IF EXISTS "WatchProgresses_mediaId_fkey";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_roleId_fkey";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_buyerId_fkey";
ALTER TABLE IF EXISTS ONLY public."UserPreferences" DROP CONSTRAINT IF EXISTS "UserPreferences_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Scripts" DROP CONSTRAINT IF EXISTS "Scripts_productionId_fkey";
ALTER TABLE IF EXISTS ONLY public."ScriptAssignments" DROP CONSTRAINT IF EXISTS "ScriptAssignments_talentId_fkey";
ALTER TABLE IF EXISTS ONLY public."ScriptAssignments" DROP CONSTRAINT IF EXISTS "ScriptAssignments_scriptId_fkey";
ALTER TABLE IF EXISTS ONLY public."Sales" DROP CONSTRAINT IF EXISTS "Sales_productionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Sales" DROP CONSTRAINT IF EXISTS "Sales_contractId_fkey";
ALTER TABLE IF EXISTS ONLY public."Sales" DROP CONSTRAINT IF EXISTS "Sales_buyerId_fkey";
ALTER TABLE IF EXISTS ONLY public."Revenues" DROP CONSTRAINT IF EXISTS "Revenues_productionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Productions" DROP CONSTRAINT IF EXISTS "Productions_directorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Productions" DROP CONSTRAINT IF EXISTS "Productions_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public."ProductionTalents" DROP CONSTRAINT IF EXISTS "ProductionTalents_talentId_fkey";
ALTER TABLE IF EXISTS ONLY public."ProductionTalents" DROP CONSTRAINT IF EXISTS "ProductionTalents_productionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Notifications" DROP CONSTRAINT IF EXISTS "Notifications_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."MediaInteractions" DROP CONSTRAINT IF EXISTS "MediaInteractions_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."MediaInteractions" DROP CONSTRAINT IF EXISTS "MediaInteractions_mediaId_fkey";
ALTER TABLE IF EXISTS ONLY public."MediaFiles" DROP CONSTRAINT IF EXISTS "MediaFiles_productionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Expenses" DROP CONSTRAINT IF EXISTS "Expenses_productionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Events" DROP CONSTRAINT IF EXISTS "Events_productionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_productionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_buyerId_fkey";
ALTER TABLE IF EXISTS ONLY public."Attendances" DROP CONSTRAINT IF EXISTS "Attendances_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Attendances" DROP CONSTRAINT IF EXISTS "Attendances_eventId_fkey";
ALTER TABLE IF EXISTS ONLY auth.webauthn_credentials DROP CONSTRAINT IF EXISTS webauthn_credentials_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.webauthn_challenges DROP CONSTRAINT IF EXISTS webauthn_challenges_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_oauth_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_flow_state_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_auth_factor_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_user_id_fkey;
DROP TRIGGER IF EXISTS update_objects_updated_at ON storage.objects;
DROP TRIGGER IF EXISTS protect_objects_delete ON storage.objects;
DROP TRIGGER IF EXISTS protect_buckets_delete ON storage.buckets;
DROP TRIGGER IF EXISTS enforce_bucket_name_length_trigger ON storage.buckets;
DROP TRIGGER IF EXISTS tr_check_filters ON realtime.subscription;
DROP INDEX IF EXISTS storage.vector_indexes_name_bucket_id_idx;
DROP INDEX IF EXISTS storage.name_prefix_search;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name_lower;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name;
DROP INDEX IF EXISTS storage.idx_multipart_uploads_list;
DROP INDEX IF EXISTS storage.buckets_analytics_unique_name_idx;
DROP INDEX IF EXISTS storage.bucketid_objname;
DROP INDEX IF EXISTS storage.bname;
DROP INDEX IF EXISTS realtime.subscription_subscription_id_entity_filters_action_filter_selec;
DROP INDEX IF EXISTS realtime.messages_inserted_at_topic_index;
DROP INDEX IF EXISTS realtime.ix_realtime_subscription_entity;
DROP INDEX IF EXISTS auth.webauthn_credentials_user_id_idx;
DROP INDEX IF EXISTS auth.webauthn_credentials_credential_id_key;
DROP INDEX IF EXISTS auth.webauthn_challenges_user_id_idx;
DROP INDEX IF EXISTS auth.webauthn_challenges_expires_at_idx;
DROP INDEX IF EXISTS auth.users_is_anonymous_idx;
DROP INDEX IF EXISTS auth.users_instance_id_idx;
DROP INDEX IF EXISTS auth.users_instance_id_email_idx;
DROP INDEX IF EXISTS auth.users_email_partial_key;
DROP INDEX IF EXISTS auth.user_id_created_at_idx;
DROP INDEX IF EXISTS auth.unique_phone_factor_per_user;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_pattern_idx;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_domain_idx;
DROP INDEX IF EXISTS auth.sessions_user_id_idx;
DROP INDEX IF EXISTS auth.sessions_oauth_client_id_idx;
DROP INDEX IF EXISTS auth.sessions_not_after_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_for_email_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_created_at_idx;
DROP INDEX IF EXISTS auth.saml_providers_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_updated_at_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_session_id_revoked_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_parent_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_user_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_idx;
DROP INDEX IF EXISTS auth.recovery_token_idx;
DROP INDEX IF EXISTS auth.reauthentication_token_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_user_id_token_type_key;
DROP INDEX IF EXISTS auth.one_time_tokens_token_hash_hash_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_relates_to_hash_idx;
DROP INDEX IF EXISTS auth.oauth_consents_user_order_idx;
DROP INDEX IF EXISTS auth.oauth_consents_active_user_client_idx;
DROP INDEX IF EXISTS auth.oauth_consents_active_client_idx;
DROP INDEX IF EXISTS auth.oauth_clients_deleted_at_idx;
DROP INDEX IF EXISTS auth.oauth_auth_pending_exp_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_id_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_friendly_name_unique;
DROP INDEX IF EXISTS auth.mfa_challenge_created_at_idx;
DROP INDEX IF EXISTS auth.idx_users_name;
DROP INDEX IF EXISTS auth.idx_users_last_sign_in_at_desc;
DROP INDEX IF EXISTS auth.idx_users_email;
DROP INDEX IF EXISTS auth.idx_users_created_at_desc;
DROP INDEX IF EXISTS auth.idx_user_id_auth_method;
DROP INDEX IF EXISTS auth.idx_oauth_client_states_created_at;
DROP INDEX IF EXISTS auth.idx_auth_code;
DROP INDEX IF EXISTS auth.identities_user_id_idx;
DROP INDEX IF EXISTS auth.identities_email_idx;
DROP INDEX IF EXISTS auth.flow_state_created_at_idx;
DROP INDEX IF EXISTS auth.factor_id_created_at_idx;
DROP INDEX IF EXISTS auth.email_change_token_new_idx;
DROP INDEX IF EXISTS auth.email_change_token_current_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_provider_type_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_identifier_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_enabled_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_created_at_idx;
DROP INDEX IF EXISTS auth.confirmation_token_idx;
DROP INDEX IF EXISTS auth.audit_logs_instance_id_idx;
ALTER TABLE IF EXISTS ONLY storage.vector_indexes DROP CONSTRAINT IF EXISTS vector_indexes_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_pkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS objects_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_name_key;
ALTER TABLE IF EXISTS ONLY storage.buckets_vectors DROP CONSTRAINT IF EXISTS buckets_vectors_pkey;
ALTER TABLE IF EXISTS ONLY storage.buckets DROP CONSTRAINT IF EXISTS buckets_pkey;
ALTER TABLE IF EXISTS ONLY storage.buckets_analytics DROP CONSTRAINT IF EXISTS buckets_analytics_pkey;
ALTER TABLE IF EXISTS ONLY realtime.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY realtime.subscription DROP CONSTRAINT IF EXISTS pk_subscription;
ALTER TABLE IF EXISTS ONLY realtime.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS realtime.messages DROP CONSTRAINT IF EXISTS messages_payload_exclusive;
ALTER TABLE IF EXISTS ONLY public."WatchProgresses" DROP CONSTRAINT IF EXISTS "WatchProgresses_userId_mediaId_key";
ALTER TABLE IF EXISTS ONLY public."WatchProgresses" DROP CONSTRAINT IF EXISTS "WatchProgresses_pkey";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_pkey";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key94";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key93";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key92";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key91";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key90";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key9";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key89";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key88";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key87";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key86";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key85";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key84";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key83";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key82";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key81";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key80";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key8";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key79";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key78";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key77";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key76";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key75";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key74";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key73";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key72";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key71";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key70";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key7";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key69";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key68";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key67";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key66";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key65";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key64";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key63";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key62";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key61";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key60";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key6";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key59";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key58";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key57";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key56";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key55";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key54";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key53";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key52";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key51";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key50";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key5";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key49";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key48";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key47";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key46";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key45";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key44";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key43";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key42";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key41";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key40";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key4";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key39";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key38";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key37";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key36";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key35";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key34";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key33";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key32";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key31";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key30";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key3";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key29";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key28";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key27";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key26";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key25";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key24";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key23";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key22";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key21";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key20";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key2";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key19";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key18";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key17";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key16";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key15";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key14";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key13";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key12";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key11";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key10";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key1";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_email_key";
ALTER TABLE IF EXISTS ONLY public."UserPreferences" DROP CONSTRAINT IF EXISTS "UserPreferences_userId_pageKey_key";
ALTER TABLE IF EXISTS ONLY public."UserPreferences" DROP CONSTRAINT IF EXISTS "UserPreferences_pkey";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_pkey";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key92";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key91";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key90";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key9";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key89";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key88";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key87";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key86";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key85";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key84";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key83";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key82";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key81";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key80";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key8";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key79";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key78";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key77";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key76";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key75";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key74";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key73";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key72";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key71";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key70";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key7";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key69";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key68";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key67";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key66";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key65";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key64";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key63";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key62";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key61";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key60";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key6";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key59";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key58";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key57";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key56";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key55";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key54";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key53";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key52";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key51";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key50";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key5";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key49";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key48";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key47";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key46";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key45";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key44";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key43";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key42";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key41";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key40";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key4";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key39";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key38";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key37";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key36";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key35";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key34";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key33";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key32";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key31";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key30";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key3";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key29";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key28";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key27";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key26";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key25";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key24";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key23";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key22";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key21";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key20";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key2";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key19";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key18";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key17";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key16";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key15";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key14";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key13";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key12";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key11";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key10";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key1";
ALTER TABLE IF EXISTS ONLY public."Talents" DROP CONSTRAINT IF EXISTS "Talents_email_key";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_pkey";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key92";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key91";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key90";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key9";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key89";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key88";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key87";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key86";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key85";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key84";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key83";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key82";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key81";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key80";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key8";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key79";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key78";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key77";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key76";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key75";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key74";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key73";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key72";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key71";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key70";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key7";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key69";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key68";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key67";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key66";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key65";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key64";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key63";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key62";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key61";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key60";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key6";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key59";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key58";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key57";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key56";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key55";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key54";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key53";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key52";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key51";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key50";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key5";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key49";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key48";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key47";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key46";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key45";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key44";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key43";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key42";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key41";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key40";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key4";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key39";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key38";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key37";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key36";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key35";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key34";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key33";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key32";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key31";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key30";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key3";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key29";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key28";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key27";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key26";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key25";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key24";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key23";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key22";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key21";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key20";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key2";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key19";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key18";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key17";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key16";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key15";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key14";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key13";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key12";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key11";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key10";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key1";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_key_key";
ALTER TABLE IF EXISTS ONLY public."Scripts" DROP CONSTRAINT IF EXISTS "Scripts_pkey";
ALTER TABLE IF EXISTS ONLY public."ScriptAssignments" DROP CONSTRAINT IF EXISTS "ScriptAssignments_pkey";
ALTER TABLE IF EXISTS ONLY public."Sales" DROP CONSTRAINT IF EXISTS "Sales_pkey";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_pkey";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key94";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key93";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key92";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key91";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key90";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key9";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key89";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key88";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key87";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key86";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key85";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key84";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key83";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key82";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key81";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key80";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key8";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key79";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key78";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key77";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key76";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key75";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key74";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key73";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key72";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key71";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key70";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key7";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key69";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key68";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key67";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key66";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key65";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key64";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key63";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key62";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key61";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key60";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key6";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key59";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key58";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key57";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key56";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key55";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key54";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key53";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key52";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key51";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key50";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key5";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key49";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key48";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key47";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key46";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key45";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key44";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key43";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key42";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key41";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key40";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key4";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key39";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key38";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key37";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key36";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key35";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key34";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key33";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key32";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key31";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key30";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key3";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key29";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key28";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key27";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key26";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key25";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key24";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key23";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key22";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key21";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key20";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key2";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key19";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key18";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key17";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key16";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key15";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key14";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key13";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key12";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key11";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key10";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key1";
ALTER TABLE IF EXISTS ONLY public."Roles" DROP CONSTRAINT IF EXISTS "Roles_name_key";
ALTER TABLE IF EXISTS ONLY public."Revenues" DROP CONSTRAINT IF EXISTS "Revenues_pkey";
ALTER TABLE IF EXISTS ONLY public."Productions" DROP CONSTRAINT IF EXISTS "Productions_pkey";
ALTER TABLE IF EXISTS ONLY public."ProductionTalents" DROP CONSTRAINT IF EXISTS "ProductionTalents_pkey";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_pkey";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key93";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key92";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key91";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key90";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key9";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key89";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key88";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key87";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key86";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key85";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key84";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key83";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key82";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key81";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key80";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key8";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key79";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key78";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key77";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key76";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key75";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key74";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key73";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key72";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key71";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key70";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key7";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key69";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key68";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key67";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key66";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key65";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key64";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key63";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key62";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key61";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key60";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key6";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key59";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key58";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key57";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key56";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key55";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key54";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key53";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key52";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key51";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key50";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key5";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key49";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key48";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key47";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key46";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key45";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key44";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key43";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key42";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key41";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key40";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key4";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key39";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key38";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key37";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key36";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key35";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key34";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key33";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key32";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key31";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key30";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key3";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key29";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key28";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key27";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key26";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key25";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key24";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key23";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key22";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key21";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key20";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key2";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key19";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key18";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key17";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key16";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key15";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key14";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key13";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key12";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key11";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key10";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key1";
ALTER TABLE IF EXISTS ONLY public."ProductionCategories" DROP CONSTRAINT IF EXISTS "ProductionCategories_name_key";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_pkey";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key92";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key91";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key90";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key9";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key89";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key88";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key87";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key86";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key85";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key84";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key83";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key82";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key81";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key80";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key8";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key79";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key78";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key77";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key76";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key75";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key74";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key73";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key72";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key71";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key70";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key7";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key69";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key68";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key67";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key66";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key65";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key64";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key63";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key62";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key61";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key60";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key6";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key59";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key58";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key57";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key56";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key55";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key54";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key53";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key52";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key51";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key50";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key5";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key49";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key48";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key47";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key46";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key45";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key44";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key43";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key42";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key41";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key40";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key4";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key39";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key38";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key37";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key36";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key35";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key34";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key33";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key32";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key31";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key30";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key3";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key29";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key28";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key27";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key26";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key25";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key24";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key23";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key22";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key21";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key20";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key2";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key19";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key18";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key17";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key16";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key15";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key14";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key13";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key12";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key11";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key10";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key1";
ALTER TABLE IF EXISTS ONLY public."PendingUsers" DROP CONSTRAINT IF EXISTS "PendingUsers_email_key";
ALTER TABLE IF EXISTS ONLY public."Notifications" DROP CONSTRAINT IF EXISTS "Notifications_pkey";
ALTER TABLE IF EXISTS ONLY public."MediaInteractions" DROP CONSTRAINT IF EXISTS "MediaInteractions_pkey";
ALTER TABLE IF EXISTS ONLY public."MediaFiles" DROP CONSTRAINT IF EXISTS "MediaFiles_pkey";
ALTER TABLE IF EXISTS ONLY public."Expenses" DROP CONSTRAINT IF EXISTS "Expenses_pkey";
ALTER TABLE IF EXISTS ONLY public."Events" DROP CONSTRAINT IF EXISTS "Events_pkey";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_pkey";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key92";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key91";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key90";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key9";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key89";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key88";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key87";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key86";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key85";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key84";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key83";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key82";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key81";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key80";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key8";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key79";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key78";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key77";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key76";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key75";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key74";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key73";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key72";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key71";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key70";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key7";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key69";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key68";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key67";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key66";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key65";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key64";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key63";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key62";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key61";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key60";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key6";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key59";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key58";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key57";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key56";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key55";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key54";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key53";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key52";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key51";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key50";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key5";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key49";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key48";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key47";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key46";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key45";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key44";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key43";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key42";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key41";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key40";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key4";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key39";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key38";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key37";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key36";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key35";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key34";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key33";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key32";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key31";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key30";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key3";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key29";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key28";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key27";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key26";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key25";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key24";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key23";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key22";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key21";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key20";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key2";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key19";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key18";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key17";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key16";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key15";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key14";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key13";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key12";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key11";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key10";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key1";
ALTER TABLE IF EXISTS ONLY public."Contracts" DROP CONSTRAINT IF EXISTS "Contracts_contractNumber_key";
ALTER TABLE IF EXISTS ONLY public."Buyers" DROP CONSTRAINT IF EXISTS "Buyers_pkey";
ALTER TABLE IF EXISTS ONLY public."BuyerRequests" DROP CONSTRAINT IF EXISTS "BuyerRequests_pkey";
ALTER TABLE IF EXISTS ONLY public."Attendances" DROP CONSTRAINT IF EXISTS "Attendances_pkey";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key9";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key8";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key7";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key62";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key61";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key60";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key6";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key59";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key58";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key57";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key56";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key55";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key54";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key53";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key52";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key51";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key50";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key5";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key49";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key48";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key47";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key46";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key45";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key44";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key43";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key42";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key41";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key40";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key4";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key39";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key38";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key37";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key36";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key35";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key34";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key33";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key32";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key31";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key30";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key3";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key29";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key28";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key27";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key26";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key25";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key24";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key23";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key22";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key21";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key20";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key2";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key19";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key18";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key17";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key16";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key15";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key14";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key13";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key12";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key11";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key10";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key1";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_publicToken_key";
ALTER TABLE IF EXISTS ONLY public."AttendanceRules" DROP CONSTRAINT IF EXISTS "AttendanceRules_pkey";
ALTER TABLE IF EXISTS ONLY auth.webauthn_credentials DROP CONSTRAINT IF EXISTS webauthn_credentials_pkey;
ALTER TABLE IF EXISTS ONLY auth.webauthn_challenges DROP CONSTRAINT IF EXISTS webauthn_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_phone_key;
ALTER TABLE IF EXISTS ONLY auth.sso_providers DROP CONSTRAINT IF EXISTS sso_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_pkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY auth.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_entity_id_key;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_token_unique;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_user_client_unique;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_clients DROP CONSTRAINT IF EXISTS oauth_clients_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_client_states DROP CONSTRAINT IF EXISTS oauth_client_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_authorization_id_key;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_authorization_code_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_last_challenged_at_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_authentication_method_pkey;
ALTER TABLE IF EXISTS ONLY auth.instances DROP CONSTRAINT IF EXISTS instances_pkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_provider_id_provider_unique;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_pkey;
ALTER TABLE IF EXISTS ONLY auth.flow_state DROP CONSTRAINT IF EXISTS flow_state_pkey;
ALTER TABLE IF EXISTS ONLY auth.custom_oauth_providers DROP CONSTRAINT IF EXISTS custom_oauth_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.custom_oauth_providers DROP CONSTRAINT IF EXISTS custom_oauth_providers_identifier_key;
ALTER TABLE IF EXISTS ONLY auth.audit_log_entries DROP CONSTRAINT IF EXISTS audit_log_entries_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS amr_id_pk;
ALTER TABLE IF EXISTS public."WatchProgresses" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Users" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."UserPreferences" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Talents" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."SystemSettings" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Scripts" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Sales" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Roles" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Revenues" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Productions" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."ProductionCategories" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."PendingUsers" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Notifications" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."MediaInteractions" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."MediaFiles" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Expenses" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Events" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Contracts" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Buyers" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."BuyerRequests" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Attendances" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."AttendanceRules" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS auth.refresh_tokens ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS storage.vector_indexes;
DROP TABLE IF EXISTS storage.s3_multipart_uploads_parts;
DROP TABLE IF EXISTS storage.s3_multipart_uploads;
DROP TABLE IF EXISTS storage.objects;
DROP TABLE IF EXISTS storage.migrations;
DROP TABLE IF EXISTS storage.buckets_vectors;
DROP TABLE IF EXISTS storage.buckets_analytics;
DROP TABLE IF EXISTS storage.buckets;
DROP TABLE IF EXISTS realtime.subscription;
DROP TABLE IF EXISTS realtime.schema_migrations;
DROP TABLE IF EXISTS realtime.messages;
DROP SEQUENCE IF EXISTS public."WatchProgresses_id_seq";
DROP TABLE IF EXISTS public."WatchProgresses";
DROP SEQUENCE IF EXISTS public."Users_id_seq";
DROP TABLE IF EXISTS public."Users";
DROP SEQUENCE IF EXISTS public."UserPreferences_id_seq";
DROP TABLE IF EXISTS public."UserPreferences";
DROP SEQUENCE IF EXISTS public."Talents_id_seq";
DROP TABLE IF EXISTS public."Talents";
DROP SEQUENCE IF EXISTS public."SystemSettings_id_seq";
DROP TABLE IF EXISTS public."SystemSettings";
DROP SEQUENCE IF EXISTS public."Scripts_id_seq";
DROP TABLE IF EXISTS public."Scripts";
DROP TABLE IF EXISTS public."ScriptAssignments";
DROP SEQUENCE IF EXISTS public."Sales_id_seq";
DROP TABLE IF EXISTS public."Sales";
DROP SEQUENCE IF EXISTS public."Roles_id_seq";
DROP TABLE IF EXISTS public."Roles";
DROP SEQUENCE IF EXISTS public."Revenues_id_seq";
DROP TABLE IF EXISTS public."Revenues";
DROP SEQUENCE IF EXISTS public."Productions_id_seq";
DROP TABLE IF EXISTS public."Productions";
DROP TABLE IF EXISTS public."ProductionTalents";
DROP SEQUENCE IF EXISTS public."ProductionCategories_id_seq";
DROP TABLE IF EXISTS public."ProductionCategories";
DROP SEQUENCE IF EXISTS public."PendingUsers_id_seq";
DROP TABLE IF EXISTS public."PendingUsers";
DROP SEQUENCE IF EXISTS public."Notifications_id_seq";
DROP TABLE IF EXISTS public."Notifications";
DROP SEQUENCE IF EXISTS public."MediaInteractions_id_seq";
DROP TABLE IF EXISTS public."MediaInteractions";
DROP SEQUENCE IF EXISTS public."MediaFiles_id_seq";
DROP TABLE IF EXISTS public."MediaFiles";
DROP SEQUENCE IF EXISTS public."Expenses_id_seq";
DROP TABLE IF EXISTS public."Expenses";
DROP SEQUENCE IF EXISTS public."Events_id_seq";
DROP TABLE IF EXISTS public."Events";
DROP SEQUENCE IF EXISTS public."Contracts_id_seq";
DROP TABLE IF EXISTS public."Contracts";
DROP SEQUENCE IF EXISTS public."Buyers_id_seq";
DROP TABLE IF EXISTS public."Buyers";
DROP SEQUENCE IF EXISTS public."BuyerRequests_id_seq";
DROP TABLE IF EXISTS public."BuyerRequests";
DROP SEQUENCE IF EXISTS public."Attendances_id_seq";
DROP TABLE IF EXISTS public."Attendances";
DROP SEQUENCE IF EXISTS public."AttendanceRules_id_seq";
DROP TABLE IF EXISTS public."AttendanceRules";
DROP TABLE IF EXISTS auth.webauthn_credentials;
DROP TABLE IF EXISTS auth.webauthn_challenges;
DROP TABLE IF EXISTS auth.users;
DROP TABLE IF EXISTS auth.sso_providers;
DROP TABLE IF EXISTS auth.sso_domains;
DROP TABLE IF EXISTS auth.sessions;
DROP TABLE IF EXISTS auth.schema_migrations;
DROP TABLE IF EXISTS auth.saml_relay_states;
DROP TABLE IF EXISTS auth.saml_providers;
DROP SEQUENCE IF EXISTS auth.refresh_tokens_id_seq;
DROP TABLE IF EXISTS auth.refresh_tokens;
DROP TABLE IF EXISTS auth.one_time_tokens;
DROP TABLE IF EXISTS auth.oauth_consents;
DROP TABLE IF EXISTS auth.oauth_clients;
DROP TABLE IF EXISTS auth.oauth_client_states;
DROP TABLE IF EXISTS auth.oauth_authorizations;
DROP TABLE IF EXISTS auth.mfa_factors;
DROP TABLE IF EXISTS auth.mfa_challenges;
DROP TABLE IF EXISTS auth.mfa_amr_claims;
DROP TABLE IF EXISTS auth.instances;
DROP TABLE IF EXISTS auth.identities;
DROP TABLE IF EXISTS auth.flow_state;
DROP TABLE IF EXISTS auth.custom_oauth_providers;
DROP TABLE IF EXISTS auth.audit_log_entries;
DROP FUNCTION IF EXISTS storage.update_updated_at_column();
DROP FUNCTION IF EXISTS storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text);
DROP FUNCTION IF EXISTS storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text);
DROP FUNCTION IF EXISTS storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.protect_delete();
DROP FUNCTION IF EXISTS storage.operation();
DROP FUNCTION IF EXISTS storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text);
DROP FUNCTION IF EXISTS storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text);
DROP FUNCTION IF EXISTS storage.get_size_by_bucket();
DROP FUNCTION IF EXISTS storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text);
DROP FUNCTION IF EXISTS storage.foldername(name text);
DROP FUNCTION IF EXISTS storage.filename(name text);
DROP FUNCTION IF EXISTS storage.extension(name text);
DROP FUNCTION IF EXISTS storage.enforce_bucket_name_length();
DROP FUNCTION IF EXISTS storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb);
DROP FUNCTION IF EXISTS storage.allow_only_operation(expected_operation text);
DROP FUNCTION IF EXISTS storage.allow_any_operation(expected_operations text[]);
DROP FUNCTION IF EXISTS realtime.wal2json_escape_identifier(name text);
DROP FUNCTION IF EXISTS realtime.topic();
DROP FUNCTION IF EXISTS realtime.to_regrole(role_name text);
DROP FUNCTION IF EXISTS realtime.subscription_check_filters();
DROP FUNCTION IF EXISTS realtime.send_binary(payload bytea, event text, topic text, private boolean);
DROP FUNCTION IF EXISTS realtime.send(payload jsonb, event text, topic text, private boolean);
DROP FUNCTION IF EXISTS realtime.quote_wal2json(entity regclass);
DROP FUNCTION IF EXISTS realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer);
DROP FUNCTION IF EXISTS realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]);
DROP FUNCTION IF EXISTS realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean);
DROP FUNCTION IF EXISTS realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text);
DROP FUNCTION IF EXISTS realtime."cast"(val text, type_ regtype);
DROP FUNCTION IF EXISTS realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]);
DROP FUNCTION IF EXISTS realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text);
DROP FUNCTION IF EXISTS realtime.apply_rls(wal jsonb, max_record_bytes integer);
DROP FUNCTION IF EXISTS pgbouncer.get_auth(p_usename text);
DROP FUNCTION IF EXISTS graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb);
DROP FUNCTION IF EXISTS extensions.set_graphql_placeholder();
DROP FUNCTION IF EXISTS extensions.pgrst_drop_watch();
DROP FUNCTION IF EXISTS extensions.pgrst_ddl_watch();
DROP FUNCTION IF EXISTS extensions.grant_pg_net_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_graphql_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_cron_access();
DROP FUNCTION IF EXISTS auth.uid();
DROP FUNCTION IF EXISTS auth.role();
DROP FUNCTION IF EXISTS auth.jwt();
DROP FUNCTION IF EXISTS auth.email();
DROP TYPE IF EXISTS storage.buckettype;
DROP TYPE IF EXISTS realtime.wal_rls;
DROP TYPE IF EXISTS realtime.wal_column;
DROP TYPE IF EXISTS realtime.user_defined_filter;
DROP TYPE IF EXISTS realtime.equality_op;
DROP TYPE IF EXISTS realtime.action;
DROP TYPE IF EXISTS public."enum_Users_subscriptionStatus";
DROP TYPE IF EXISTS public."enum_Users_status";
DROP TYPE IF EXISTS public."enum_Scripts_status";
DROP TYPE IF EXISTS public."enum_Sales_saleType";
DROP TYPE IF EXISTS public."enum_Sales_paymentStatus";
DROP TYPE IF EXISTS public."enum_Productions_type";
DROP TYPE IF EXISTS public."enum_Productions_status";
DROP TYPE IF EXISTS public."enum_MediaInteractions_type";
DROP TYPE IF EXISTS public."enum_Expenses_category";
DROP TYPE IF EXISTS public."enum_Events_type";
DROP TYPE IF EXISTS public."enum_Events_status";
DROP TYPE IF EXISTS public."enum_Contracts_status";
DROP TYPE IF EXISTS public."enum_Buyers_type";
DROP TYPE IF EXISTS public."enum_BuyerRequests_type";
DROP TYPE IF EXISTS public."enum_BuyerRequests_status";
DROP TYPE IF EXISTS public."enum_Attendances_status";
DROP TYPE IF EXISTS auth.one_time_token_type;
DROP TYPE IF EXISTS auth.oauth_response_type;
DROP TYPE IF EXISTS auth.oauth_registration_type;
DROP TYPE IF EXISTS auth.oauth_client_type;
DROP TYPE IF EXISTS auth.oauth_authorization_status;
DROP TYPE IF EXISTS auth.factor_type;
DROP TYPE IF EXISTS auth.factor_status;
DROP TYPE IF EXISTS auth.code_challenge_method;
DROP TYPE IF EXISTS auth.aal_level;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS supabase_vault;
DROP EXTENSION IF EXISTS pgcrypto;
DROP EXTENSION IF EXISTS pg_stat_statements;
DROP SCHEMA IF EXISTS vault;
DROP SCHEMA IF EXISTS storage;
DROP SCHEMA IF EXISTS realtime;
DROP SCHEMA IF EXISTS pgbouncer;
DROP SCHEMA IF EXISTS graphql_public;
DROP SCHEMA IF EXISTS graphql;
DROP SCHEMA IF EXISTS extensions;
DROP SCHEMA IF EXISTS auth;
--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: enum_Attendances_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Attendances_status" AS ENUM (
    'Present',
    'Absent',
    'Late',
    'Excused'
);


--
-- Name: enum_BuyerRequests_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_BuyerRequests_status" AS ENUM (
    'Pending',
    'Approved',
    'Rejected'
);


--
-- Name: enum_BuyerRequests_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_BuyerRequests_type" AS ENUM (
    'TV Channel',
    'Radio Station',
    'Streaming Platform',
    'Individual',
    'Production Company'
);


--
-- Name: enum_Buyers_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Buyers_type" AS ENUM (
    'TV Channel',
    'Radio Station',
    'Streaming Platform',
    'Individual',
    'Production Company'
);


--
-- Name: enum_Contracts_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Contracts_status" AS ENUM (
    'Active',
    'Expired',
    'Terminated'
);


--
-- Name: enum_Events_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Events_status" AS ENUM (
    'Scheduled',
    'Completed',
    'Cancelled'
);


--
-- Name: enum_Events_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Events_type" AS ENUM (
    'Rehearsal',
    'Performance',
    'Meeting',
    'Filming'
);


--
-- Name: enum_Expenses_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Expenses_category" AS ENUM (
    'Equipment',
    'Transport',
    'Actor payment',
    'Venue',
    'Editing',
    'Marketing',
    'Other'
);


--
-- Name: enum_MediaInteractions_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_MediaInteractions_type" AS ENUM (
    'like',
    'unlike'
);


--
-- Name: enum_Productions_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Productions_status" AS ENUM (
    'Draft',
    'Writing',
    'Rehearsal',
    'Filming',
    'Editing',
    'Released',
    'Sold/Licensed'
);


--
-- Name: enum_Productions_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Productions_type" AS ENUM (
    'Movie',
    'Series',
    'Theatre',
    'Radio Drama',
    'Journal/Paper',
    'Script'
);


--
-- Name: enum_Sales_paymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Sales_paymentStatus" AS ENUM (
    'Pending',
    'Paid',
    'Partial'
);


--
-- Name: enum_Sales_saleType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Sales_saleType" AS ENUM (
    'Full ownership sale',
    'Licensing',
    'Broadcast rights',
    'Script sale',
    'Theatre ticket sales'
);


--
-- Name: enum_Scripts_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Scripts_status" AS ENUM (
    'Draft',
    'Under Review',
    'Approved',
    'Rejected'
);


--
-- Name: enum_Users_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Users_status" AS ENUM (
    'active',
    'inactive',
    'suspended'
);


--
-- Name: enum_Users_subscriptionStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Users_subscriptionStatus" AS ENUM (
    'active',
    'inactive',
    'expired'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in',
    'like',
    'ilike',
    'is',
    'match',
    'imatch',
    'isdistinct'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text,
	negate boolean
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
begin
    if not exists (
        select 1
        from pg_event_trigger_ddl_commands() ev
        join pg_catalog.pg_extension e on ev.objid = e.oid
        where e.extname = 'pg_graphql'
    ) then
        return;
    end if;

    drop function if exists graphql_public.graphql;
    create or replace function graphql_public.graphql(
        "operationName" text default null,
        query text default null,
        variables jsonb default null,
        extensions jsonb default null
    )
        returns jsonb
        language sql
    as $$
        select graphql.resolve(
            query := query,
            variables := coalesce(variables, '{}'),
            "operationName" := "operationName",
            extensions := extensions
        );
    $$;

    -- Attach the wrapper to the extension so DROP EXTENSION cascades to it,
    -- which in turn triggers set_graphql_placeholder to reinstall the "not enabled" stub.
    alter extension pg_graphql add function graphql_public.graphql(text, text, jsonb, jsonb);

    grant usage on schema graphql to postgres, anon, authenticated, service_role;
    grant execute on function graphql.resolve to postgres, anon, authenticated, service_role;
    grant usage on schema graphql to postgres with grant option;
    grant usage on schema graphql_public to postgres with grant option;
end;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: graphql_public; Owner: -
--

CREATE FUNCTION graphql_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
    -- Regclass of the table e.g. public.notes
    entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

    -- I, U, D, T: insert, update ...
    action realtime.action = (
        case wal ->> 'action'
            when 'I' then 'INSERT'
            when 'U' then 'UPDATE'
            when 'D' then 'DELETE'
            else 'ERROR'
        end
    );

    -- Is row level security enabled for the table
    is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

    subscriptions realtime.subscription[] = array_agg(subs)
        from
            realtime.subscription subs
        where
            subs.entity = entity_
            -- Filter by action early - only get subscriptions interested in this action
            -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
            and (subs.action_filter = '*' or subs.action_filter = action::text);

    -- Subscription vars
    working_role regrole;
    working_selected_columns text[];
    claimed_role regrole;
    claims jsonb;

    subscription_id uuid;
    subscription_has_access bool;
    visible_to_subscription_ids uuid[] = '{}';

    -- structured info for wal's columns
    columns realtime.wal_column[];
    -- previous identity values for update/delete
    old_columns realtime.wal_column[];

    error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

    -- Primary jsonb output for record
    output jsonb;

    -- Loop record for iterating unique roles (outer loop)
    role_record record;
    -- Loop record for iterating unique selected_columns within a role (inner loop)
    cols_record record;
    -- Subscription ids visible at the role level (before fanning out by selected_columns)
    visible_role_sub_ids uuid[] = '{}';

begin
    perform set_config('role', null, true);

    columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'columns') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    old_columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'identity') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    for role_record in
        select claims_role
        from (select distinct claims_role from unnest(subscriptions)) t
        order by claims_role::text
    loop
        working_role := role_record.claims_role;

        -- Update `is_selectable` for columns and old_columns (once per role)
        columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(columns) c;

        old_columns =
                array_agg(
                    (
                        c.name,
                        c.type_name,
                        c.type_oid,
                        c.value,
                        c.is_pkey,
                        pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                    )::realtime.wal_column
                )
                from
                    unnest(old_columns) c;

        if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
            -- Fan out 400 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 400: Bad Request, no primary key']
                )::realtime.wal_rls;
            end loop;

        -- The claims role does not have SELECT permission to the primary key of entity
        elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
            -- Fan out 401 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 401: Unauthorized']
                )::realtime.wal_rls;
            end loop;

        else
            -- Create the prepared statement (once per role)
            if is_rls_enabled and action <> 'DELETE' then
                if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                    deallocate walrus_rls_stmt;
                end if;
                execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
            end if;

            -- Collect all visible subscription IDs for this role (filter check + RLS check)
            visible_role_sub_ids = '{}';

            for subscription_id, claims in (
                    select
                        subs.subscription_id,
                        subs.claims
                    from
                        unnest(subscriptions) subs
                    where
                        subs.entity = entity_
                        and subs.claims_role = working_role
                        and (
                            realtime.is_visible_through_filters(columns, subs.filters)
                            or (
                              action = 'DELETE'
                              and realtime.is_visible_through_filters(old_columns, subs.filters)
                            )
                        )
            ) loop

                if not is_rls_enabled or action = 'DELETE' then
                    visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                else
                    -- Check if RLS allows the role to see the record
                    perform
                        -- Trim leading and trailing quotes from working_role because set_config
                        -- doesn't recognize the role as valid if they are included
                        set_config('role', trim(both '"' from working_role::text), true),
                        set_config('request.jwt.claims', claims::text, true);

                    execute 'execute walrus_rls_stmt' into subscription_has_access;

                    if subscription_has_access then
                        visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                    end if;
                end if;
            end loop;

            perform set_config('role', null, true);

            -- Inner loop: per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;

                output = jsonb_build_object(
                    'schema', wal ->> 'schema',
                    'table', wal ->> 'table',
                    'type', action,
                    'commit_timestamp', to_char(
                        ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                        'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
                    ),
                    'columns', (
                        select
                            jsonb_agg(
                                jsonb_build_object(
                                    'name', pa.attname,
                                    'type', pt.typname
                                )
                                order by pa.attnum asc
                            )
                        from
                            pg_attribute pa
                            join pg_type pt
                                on pa.atttypid = pt.oid
                            left join (
                                select unnest(conkey) as pkey_attnum
                                from pg_constraint
                                where conrelid = entity_ and contype = 'p'
                            ) pk on pk.pkey_attnum = pa.attnum
                        where
                            attrelid = entity_
                            and attnum > 0
                            and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
                            and (working_selected_columns is null or pa.attname = any(working_selected_columns) or pk.pkey_attnum is not null)
                    )
                )
                -- Add "record" key for insert and update
                || case
                    when action in ('INSERT', 'UPDATE') then
                        jsonb_build_object(
                            'record',
                            (
                                select
                                    jsonb_object_agg(
                                        -- if unchanged toast, get column name and value from old record
                                        coalesce((c).name, (oc).name),
                                        case
                                            when (c).name is null then (oc).value
                                            else (c).value
                                        end
                                    )
                                from
                                    unnest(columns) c
                                    full outer join unnest(old_columns) oc
                                        on (c).name = (oc).name
                                where
                                    coalesce((c).is_selectable, (oc).is_selectable)
                                    and (working_selected_columns is null or coalesce((c).name, (oc).name) = any(working_selected_columns) or coalesce((c).is_pkey, (oc).is_pkey))
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            )
                        )
                    else '{}'::jsonb
                end
                -- Add "old_record" key for update and delete
                || case
                    when action = 'UPDATE' then
                        jsonb_build_object(
                                'old_record',
                                (
                                    select jsonb_object_agg((c).name, (c).value)
                                    from unnest(old_columns) c
                                    where
                                        (c).is_selectable
                                        and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                        and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                )
                            )
                    when action = 'DELETE' then
                        jsonb_build_object(
                            'old_record',
                            (
                                select jsonb_object_agg((c).name, (c).value)
                                from unnest(old_columns) c
                                where
                                    (c).is_selectable
                                    and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                    and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                            )
                        )
                    else '{}'::jsonb
                end;

                -- Filter visible_role_sub_ids to those matching the current selected_columns group
                visible_to_subscription_ids = coalesce(
                    (
                        select array_agg(s.subscription_id)
                        from unnest(subscriptions) s
                        where s.claims_role = working_role
                          and (s.selected_columns is not distinct from working_selected_columns)
                          and s.subscription_id = any(visible_role_sub_ids)
                    ),
                    '{}'::uuid[]
                );

                return next (
                    output,
                    is_rls_enabled,
                    visible_to_subscription_ids,
                    case
                        when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                        else '{}'
                    end
                )::realtime.wal_rls;
            end loop;

        end if;
    end loop;

    perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
/*
Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
*/
declare
    op_symbol text = (
        case
            when op = 'eq' then '='
            when op = 'neq' then '!='
            when op = 'lt' then '<'
            when op = 'lte' then '<='
            when op = 'gt' then '>'
            when op = 'gte' then '>='
            when op = 'in' then '= any'
            else 'UNKNOWN OP'
        end
    );
    res boolean;
begin
    execute format(
        'select %L::'|| type_::text || ' ' || op_symbol
        || ' ( %L::'
        || (
            case
                when op = 'in' then type_::text || '[]'
                else type_::text end
        )
        || ')', val_1, val_2) into res;
    return res;
end;
$$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) RETURNS boolean
    LANGUAGE plpgsql STABLE
    AS $$
declare
    op_symbol text;
    res boolean;
begin
    -- IS DISTINCT FROM / IS NOT DISTINCT FROM: infix, both sides typed literals
    if op = 'isdistinct' then
        execute format(
            'select %L::%s %s %L::%s',
            val_1,
            type_::text,
            case when negate then 'IS NOT DISTINCT FROM' else 'IS DISTINCT FROM' end,
            val_2,
            type_::text
        ) into res;
        return res;
    end if;

    -- IS requires a keyword RHS (NULL, TRUE, FALSE, UNKNOWN), not a typed literal
    if op = 'is' then
        if val_2 not in ('null', 'true', 'false', 'unknown') then
            raise exception 'invalid value for is filter: must be null, true, false, or unknown';
        end if;
        execute format(
            'select %L::%s %s %s',
            val_1,
            type_::text,
            case when negate then 'IS NOT' else 'IS' end,
            upper(val_2)
        ) into res;
        return res;
    end if;

    op_symbol = case
        when op = 'eq'    then '='
        when op = 'neq'   then '!='
        when op = 'lt'    then '<'
        when op = 'lte'   then '<='
        when op = 'gt'    then '>'
        when op = 'gte'   then '>='
        when op = 'in'    then '= any'
        when op = 'like'   then 'LIKE'
        when op = 'ilike'  then 'ILIKE'
        when op = 'match'  then '~'
        when op = 'imatch' then '~*'
        else null
    end;

    if op_symbol is null then
        raise exception 'unsupported equality operator: %', op::text;
    end if;

    execute format(
        'select %L::%s %s (%L::%s)',
        val_1,
        type_::text,
        op_symbol,
        val_2,
        case when op = 'in' then type_::text || '[]' else type_::text end
    ) into res;

    return case when negate then not res else res end;
end;
$$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
    select
        filters is null
        or array_length(filters, 1) is null
        or coalesce(
            count(col.name) = count(1)
            and sum(
                realtime.check_equality_op(
                    op:=f.op,
                    type_:=coalesce(col.type_oid::regtype, col.type_name::regtype),
                    val_1:=col.value #>> '{}',
                    val_2:=f.value,
                    negate:=coalesce(f.negate, false)
                )::int
            ) filter (where col.name is not null) = count(col.name),
            false
        )
    from
        unnest(filters) f
        left join unnest(columns) col
            on f.column_name = col.name;
$$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  SELECT
    realtime.wal2json_escape_identifier(nsp.nspname::text)
    || '.'
    || realtime.wal2json_escape_identifier(pc.relname::text)
  FROM pg_class pc
  JOIN pg_namespace nsp ON pc.relnamespace = nsp.oid
  WHERE pc.oid = entity
$$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: send_binary(bytea, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, binary_payload, event, topic, private, extension)
    VALUES (generated_id, payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
    col_names text[] = coalesce(
            array_agg(a.attname order by a.attnum),
            '{}'::text[]
        )
        from
            pg_catalog.pg_attribute a
        where
            a.attrelid = new.entity
            and a.attnum > 0
            and not a.attisdropped
            and pg_catalog.has_column_privilege(
                (new.claims ->> 'role'),
                a.attrelid,
                a.attnum,
                'SELECT'
            );
    filter realtime.user_defined_filter;
    col_type regtype;
    in_val jsonb;
    selected_col text;
begin
    for filter in select * from unnest(new.filters) loop
        if not filter.column_name = any(col_names) then
            raise exception 'invalid column for filter %', filter.column_name;
        end if;

        col_type = (
            select atttypid::regtype
            from pg_catalog.pg_attribute
            where attrelid = new.entity
                  and attname = filter.column_name
        );
        if col_type is null then
            raise exception 'failed to lookup type for column %', filter.column_name;
        end if;

        if filter.op = 'in'::realtime.equality_op then
            in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
            if coalesce(jsonb_array_length(in_val), 0) > 100 then
                raise exception 'too many values for `in` filter. Maximum 100';
            end if;
        elsif filter.op = 'is'::realtime.equality_op then
            -- `is` requires a keyword RHS rather than a typed literal
            if filter.value not in ('null', 'true', 'false', 'unknown') then
                raise exception 'invalid value for is filter: must be null, true, false, or unknown';
            end if;
            -- IS NULL works for any type, but IS TRUE/FALSE/UNKNOWN require a boolean
            -- operand. Reject the non-null keywords on non-boolean columns here so they
            -- don't abort apply_rls at WAL time.
            if filter.value <> 'null' and col_type <> 'boolean'::regtype then
                raise exception 'is % filter requires a boolean column, got %', filter.value, col_type::text;
            end if;
        elsif filter.op in ('like'::realtime.equality_op, 'ilike'::realtime.equality_op) then
            -- like/ilike apply the text pattern operator (~~); reject column types that
            -- have no such operator instead of failing at WAL time
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = '~~' and oprleft = col_type
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
        elsif filter.op in ('match'::realtime.equality_op, 'imatch'::realtime.equality_op) then
            -- match/imatch apply the regex operators ~ / ~*; reject column types that have
            -- no such operator (e.g. integer) instead of failing at WAL time, mirroring the
            -- like/ilike guard above.
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = case when filter.op = 'imatch'::realtime.equality_op then '~*' else '~' end
                  and oprleft = col_type
                  and oprright = col_type
                  and oprresult = 'boolean'::regtype
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
            -- validate the regex eagerly so a bad pattern is rejected here, not inside
            -- apply_rls where it would abort the WAL stream for the entity
            begin
                perform '' ~ filter.value;
            exception when others then
                raise exception 'invalid regular expression for % filter: %', filter.op::text, sqlerrm;
            end;
        else
            -- eq/neq/lt/lte/gt/gte: value must be coercable to the type
            perform realtime.cast(filter.value, col_type);
        end if;
    end loop;

    if new.selected_columns is not null then
        for selected_col in select * from unnest(new.selected_columns) loop
            if not selected_col = any(col_names) then
                raise exception 'invalid column for select %', selected_col;
            end if;
        end loop;
    end if;

    -- Apply consistent order to filters so the unique constraint can't be tricked by a
    -- different filter order. negate is part of the sort key.
    new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value, f.negate),
        '{}'
    ) from unnest(new.filters) f;

    new.selected_columns = (
        select array_agg(c order by c)
        from unnest(new.selected_columns) c
    );

    return new;
end;
$$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: wal2json_escape_identifier(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.wal2json_escape_identifier(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Prefix `\`, `,`, `.`, and any whitespace with `\`
  SELECT regexp_replace(name, '([\\,.[:space:]])', '\\\1', 'g')
$$;


--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Get the last path segment (the actual filename)
    SELECT _parts[array_length(_parts, 1)] INTO _filename;
    -- Extract extension: reverse, split on '.', then reverse again
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    custom_claims_allowlist text[] DEFAULT '{}'::text[] NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


--
-- Name: AttendanceRules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AttendanceRules" (
    id integer NOT NULL,
    "targetLat" double precision NOT NULL,
    "targetLng" double precision NOT NULL,
    radius integer DEFAULT 100 NOT NULL,
    "startTime" time without time zone NOT NULL,
    "lateExtension" integer DEFAULT 30 NOT NULL,
    "publicToken" character varying(255) NOT NULL,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: AttendanceRules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."AttendanceRules_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: AttendanceRules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."AttendanceRules_id_seq" OWNED BY public."AttendanceRules".id;


--
-- Name: Attendances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Attendances" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "eventId" integer,
    "checkIn" timestamp with time zone NOT NULL,
    "checkOut" timestamp with time zone,
    status public."enum_Attendances_status" DEFAULT 'Present'::public."enum_Attendances_status",
    notes text,
    location character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "autoCheckedOut" boolean DEFAULT false,
    "checkInVideoUrl" character varying(255)
);


--
-- Name: Attendances_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Attendances_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Attendances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Attendances_id_seq" OWNED BY public."Attendances".id;


--
-- Name: BuyerRequests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BuyerRequests" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type public."enum_BuyerRequests_type" NOT NULL,
    "contactPerson" character varying(255),
    email character varying(255) NOT NULL,
    phone character varying(255),
    address text,
    message text,
    status public."enum_BuyerRequests_status" DEFAULT 'Pending'::public."enum_BuyerRequests_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: BuyerRequests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."BuyerRequests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: BuyerRequests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."BuyerRequests_id_seq" OWNED BY public."BuyerRequests".id;


--
-- Name: Buyers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Buyers" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type public."enum_Buyers_type" NOT NULL,
    "contactPerson" character varying(255),
    email character varying(255),
    phone character varying(255),
    address text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Buyers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Buyers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Buyers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Buyers_id_seq" OWNED BY public."Buyers".id;


--
-- Name: Contracts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Contracts" (
    id integer NOT NULL,
    "contractNumber" character varying(255),
    terms text,
    "expiryDate" timestamp with time zone,
    "buyerId" integer NOT NULL,
    "productionId" integer NOT NULL,
    "filePath" character varying(255),
    status public."enum_Contracts_status" DEFAULT 'Active'::public."enum_Contracts_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Contracts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Contracts_id_seq" OWNED BY public."Contracts".id;


--
-- Name: Events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Events" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    type public."enum_Events_type" NOT NULL,
    "startTime" timestamp with time zone NOT NULL,
    "endTime" timestamp with time zone NOT NULL,
    venue character varying(255),
    "posterUrl" character varying(255),
    "productionId" integer,
    description text,
    "ticketPrice" numeric(10,2) DEFAULT 0,
    "vipPrice" numeric(10,2) DEFAULT 0,
    "vvipPrice" numeric(10,2) DEFAULT 0,
    "tablePrice" numeric(10,2) DEFAULT 0,
    status public."enum_Events_status" DEFAULT 'Scheduled'::public."enum_Events_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Events_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Events_id_seq" OWNED BY public."Events".id;


--
-- Name: Expenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Expenses" (
    id integer NOT NULL,
    amount numeric(15,2) NOT NULL,
    category public."enum_Expenses_category" NOT NULL,
    description text,
    "productionId" integer NOT NULL,
    date timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Expenses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Expenses_id_seq" OWNED BY public."Expenses".id;


--
-- Name: MediaFiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MediaFiles" (
    id integer NOT NULL,
    "fileName" character varying(255) NOT NULL,
    "filePath" character varying(255) NOT NULL,
    "fileType" character varying(255),
    format character varying(255),
    category character varying(255),
    "productionId" integer,
    "isPublic" boolean DEFAULT false,
    season integer,
    "episodeNumber" integer,
    description text,
    "metaData" jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: MediaFiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."MediaFiles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: MediaFiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."MediaFiles_id_seq" OWNED BY public."MediaFiles".id;


--
-- Name: MediaInteractions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MediaInteractions" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "mediaId" integer NOT NULL,
    type public."enum_MediaInteractions_type" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: MediaInteractions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."MediaInteractions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: MediaInteractions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."MediaInteractions_id_seq" OWNED BY public."MediaInteractions".id;


--
-- Name: Notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notifications" (
    id integer NOT NULL,
    "userId" integer,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(255) NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Notifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Notifications_id_seq" OWNED BY public."Notifications".id;


--
-- Name: PendingUsers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PendingUsers" (
    id integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "roleId" integer NOT NULL,
    "verifyCode" character varying(255) NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: PendingUsers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PendingUsers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: PendingUsers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PendingUsers_id_seq" OWNED BY public."PendingUsers".id;


--
-- Name: ProductionCategories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProductionCategories" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: ProductionCategories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ProductionCategories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ProductionCategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ProductionCategories_id_seq" OWNED BY public."ProductionCategories".id;


--
-- Name: ProductionTalents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProductionTalents" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "productionId" integer NOT NULL,
    "talentId" integer NOT NULL
);


--
-- Name: Productions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Productions" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    genre character varying(255),
    language character varying(255),
    duration character varying(255),
    budget numeric(15,2),
    "releaseDate" timestamp with time zone,
    status public."enum_Productions_status" DEFAULT 'Draft'::public."enum_Productions_status",
    type public."enum_Productions_type" DEFAULT 'Movie'::public."enum_Productions_type",
    "categoryId" integer NOT NULL,
    "directorId" integer,
    "posterUrl" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Productions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Productions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Productions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Productions_id_seq" OWNED BY public."Productions".id;


--
-- Name: Revenues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Revenues" (
    id integer NOT NULL,
    amount numeric(15,2) NOT NULL,
    source character varying(255) NOT NULL,
    "productionId" integer NOT NULL,
    date timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Revenues_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Revenues_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Revenues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Revenues_id_seq" OWNED BY public."Revenues".id;


--
-- Name: Roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Roles" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Roles_id_seq" OWNED BY public."Roles".id;


--
-- Name: Sales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Sales" (
    id integer NOT NULL,
    amount numeric(15,2) NOT NULL,
    "paymentStatus" public."enum_Sales_paymentStatus" DEFAULT 'Pending'::public."enum_Sales_paymentStatus",
    "saleType" public."enum_Sales_saleType" NOT NULL,
    "contractId" integer,
    "productionId" integer NOT NULL,
    "buyerId" integer,
    "buyerName" character varying(255),
    "buyerEmail" character varying(255),
    "ticketTier" character varying(255),
    "ticketQuantity" integer DEFAULT 1,
    date timestamp with time zone,
    "expiryDate" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Sales_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Sales_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Sales_id_seq" OWNED BY public."Sales".id;


--
-- Name: ScriptAssignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ScriptAssignments" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "scriptId" integer NOT NULL,
    "talentId" integer NOT NULL
);


--
-- Name: Scripts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Scripts" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    version character varying(255) DEFAULT '1.0'::character varying,
    "filePath" character varying(255) NOT NULL,
    "fileType" character varying(255),
    status public."enum_Scripts_status" DEFAULT 'Draft'::public."enum_Scripts_status",
    "productionId" integer NOT NULL,
    "authorId" integer,
    "copyrightInfo" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "aiReview" json
);


--
-- Name: Scripts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Scripts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Scripts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Scripts_id_seq" OWNED BY public."Scripts".id;


--
-- Name: SystemSettings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SystemSettings" (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    value character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: SystemSettings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."SystemSettings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: SystemSettings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."SystemSettings_id_seq" OWNED BY public."SystemSettings".id;


--
-- Name: Talents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Talents" (
    id integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255),
    phone character varying(255),
    specialty character varying(255),
    skills text,
    bio text,
    "profilePic" character varying(255),
    "userId" integer,
    availability boolean DEFAULT true,
    "portfolioUrl" character varying(255),
    "socialLinks" jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Talents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Talents_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Talents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Talents_id_seq" OWNED BY public."Talents".id;


--
-- Name: UserPreferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserPreferences" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "pageKey" character varying(255) NOT NULL,
    "zoomLevel" integer DEFAULT 50,
    "viewMode" character varying(255) DEFAULT 'grid'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: UserPreferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."UserPreferences_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: UserPreferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."UserPreferences_id_seq" OWNED BY public."UserPreferences".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    "roleId" integer NOT NULL,
    "googleId" character varying(255),
    "profilePic" character varying(255),
    phone character varying(255),
    "buyerId" integer,
    status public."enum_Users_status" DEFAULT 'active'::public."enum_Users_status",
    "resetPasswordToken" character varying(255),
    "resetPasswordExpires" timestamp with time zone,
    "twoFactorCode" character varying(255),
    "twoFactorExpires" timestamp with time zone,
    "isTwoFactorEnabled" boolean DEFAULT false,
    "isVerified" boolean DEFAULT false,
    "emailVerifyCode" character varying(255),
    "emailVerifyExpires" timestamp with time zone,
    "subscriptionStatus" public."enum_Users_subscriptionStatus" DEFAULT 'inactive'::public."enum_Users_subscriptionStatus",
    "subscriptionExpiresAt" timestamp with time zone,
    "notificationPrefs" jsonb DEFAULT '{"emailAlerts": true, "browserAlerts": true, "marketingEmails": false, "troubleshootingAlerts": true}'::jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    theme character varying(255) DEFAULT 'dark'::character varying
);


--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: WatchProgresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."WatchProgresses" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "mediaId" integer NOT NULL,
    "productionId" integer NOT NULL,
    "currentTime" double precision DEFAULT '0'::double precision,
    duration double precision DEFAULT '0'::double precision,
    "isFinished" boolean DEFAULT false,
    "lastWatched" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: WatchProgresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."WatchProgresses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: WatchProgresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."WatchProgresses_id_seq" OWNED BY public."WatchProgresses".id;


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea
)
PARTITION BY RANGE (inserted_at);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    selected_columns text[],
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: AttendanceRules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules" ALTER COLUMN id SET DEFAULT nextval('public."AttendanceRules_id_seq"'::regclass);


--
-- Name: Attendances id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendances" ALTER COLUMN id SET DEFAULT nextval('public."Attendances_id_seq"'::regclass);


--
-- Name: BuyerRequests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BuyerRequests" ALTER COLUMN id SET DEFAULT nextval('public."BuyerRequests_id_seq"'::regclass);


--
-- Name: Buyers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Buyers" ALTER COLUMN id SET DEFAULT nextval('public."Buyers_id_seq"'::regclass);


--
-- Name: Contracts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts" ALTER COLUMN id SET DEFAULT nextval('public."Contracts_id_seq"'::regclass);


--
-- Name: Events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Events" ALTER COLUMN id SET DEFAULT nextval('public."Events_id_seq"'::regclass);


--
-- Name: Expenses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Expenses" ALTER COLUMN id SET DEFAULT nextval('public."Expenses_id_seq"'::regclass);


--
-- Name: MediaFiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MediaFiles" ALTER COLUMN id SET DEFAULT nextval('public."MediaFiles_id_seq"'::regclass);


--
-- Name: MediaInteractions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MediaInteractions" ALTER COLUMN id SET DEFAULT nextval('public."MediaInteractions_id_seq"'::regclass);


--
-- Name: Notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notifications" ALTER COLUMN id SET DEFAULT nextval('public."Notifications_id_seq"'::regclass);


--
-- Name: PendingUsers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers" ALTER COLUMN id SET DEFAULT nextval('public."PendingUsers_id_seq"'::regclass);


--
-- Name: ProductionCategories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories" ALTER COLUMN id SET DEFAULT nextval('public."ProductionCategories_id_seq"'::regclass);


--
-- Name: Productions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Productions" ALTER COLUMN id SET DEFAULT nextval('public."Productions_id_seq"'::regclass);


--
-- Name: Revenues id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Revenues" ALTER COLUMN id SET DEFAULT nextval('public."Revenues_id_seq"'::regclass);


--
-- Name: Roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles" ALTER COLUMN id SET DEFAULT nextval('public."Roles_id_seq"'::regclass);


--
-- Name: Sales id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Sales" ALTER COLUMN id SET DEFAULT nextval('public."Sales_id_seq"'::regclass);


--
-- Name: Scripts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Scripts" ALTER COLUMN id SET DEFAULT nextval('public."Scripts_id_seq"'::regclass);


--
-- Name: SystemSettings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings" ALTER COLUMN id SET DEFAULT nextval('public."SystemSettings_id_seq"'::regclass);


--
-- Name: Talents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents" ALTER COLUMN id SET DEFAULT nextval('public."Talents_id_seq"'::regclass);


--
-- Name: UserPreferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPreferences" ALTER COLUMN id SET DEFAULT nextval('public."UserPreferences_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: WatchProgresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WatchProgresses" ALTER COLUMN id SET DEFAULT nextval('public."WatchProgresses_id_seq"'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at, custom_claims_allowlist) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
20260625000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- Data for Name: AttendanceRules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AttendanceRules" (id, "targetLat", "targetLng", radius, "startTime", "lateExtension", "publicToken", "isActive", "createdAt", "updatedAt") FROM stdin;
1	-1.939	30.13	100	11:10:00	10	ad8241d037642c82f62dada2d5e904e5	f	2026-06-01 08:54:50.677+00	2026-06-01 08:54:50.921+00
2	-1.939	30.13	100	11:10:00	10	43e047c0d47953459d6e3cb568212c50	f	2026-06-01 08:54:51.043+00	2026-06-01 08:54:51.163+00
3	-1.939	30.13	100	11:10:00	10	ff2ff47bfff7f11a780c1465c1cd225e	f	2026-06-01 08:54:51.645+00	2026-06-01 08:55:08.07+00
4	-1.939	30.13	100	11:10:00	10	4cfe27f8267b8b7ed7759ebdf62f12e3	f	2026-06-01 08:54:51.653+00	2026-06-01 08:55:08.07+00
5	-1.939	30.13	100	11:10:00	10	0b1cd8e4c8b6a36288389f3956c3bd42	f	2026-06-01 08:54:51.764+00	2026-06-01 08:55:08.07+00
6	-1.939	30.13	100	11:10:00	10	76fb9204d754d1bf3dfdc3284730bb53	f	2026-06-01 08:55:08.191+00	2026-06-01 09:36:48.096+00
7	-1.9305	30.1323	900	11:40:00	10	153e003d15d7e2a0ee5e1b61ebbfcd0c	f	2026-06-01 09:36:48.226+00	2026-06-01 10:29:08.538+00
8	-1.9305	30.1323	100	12:40:00	30	08d217e5113f55fd3e5c9f11e6f0ce49	f	2026-06-01 10:29:08.66+00	2026-06-01 10:29:09.59+00
9	-1.9305	30.1323	100	12:40:00	30	e64a9b61a4c91526045a8810f3c9dcc7	f	2026-06-01 10:29:09.711+00	2026-06-01 10:32:03.656+00
10	-1.9305	30.1323	5000	12:35:00	30	f8db762ba82195b7ca8a49fef402640c	f	2026-06-01 10:32:03.817+00	2026-06-01 10:32:04.442+00
11	-1.9305	30.1323	5000	12:35:00	30	018c385d3e88eab2a6260ee93e074dd3	f	2026-06-01 10:32:04.565+00	2026-06-01 10:32:05.772+00
12	-1.9305	30.1323	5000	12:35:00	30	92328673bb2dd159163c7d51daa12479	f	2026-06-01 10:32:05.894+00	2026-06-01 10:57:49.034+00
13	-1.95	30.0589	100	13:00:00	30	946b4a8df11d42bb2d8bcef8f2493c0b	t	2026-06-01 10:57:49.17+00	2026-06-01 10:57:49.17+00
\.


--
-- Data for Name: Attendances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Attendances" (id, "userId", "eventId", "checkIn", "checkOut", status, notes, location, "createdAt", "updatedAt", "autoCheckedOut", "checkInVideoUrl") FROM stdin;
1	5	\N	2026-05-13 16:12:26.261+00	2026-05-13 16:12:29.022+00	Present	\N	Studio A	2026-05-13 16:12:26.262+00	2026-05-13 16:12:29.022+00	f	\N
2	5	\N	2026-05-13 16:12:41.694+00	2026-05-13 16:12:43.386+00	Present	\N	Studio A	2026-05-13 16:12:41.695+00	2026-05-13 16:12:43.386+00	f	\N
3	5	\N	2026-05-13 16:28:07.054+00	2026-05-13 16:28:07.599+00	Present	\N	City of Kigali	2026-05-13 16:28:07.061+00	2026-05-13 16:28:07.599+00	f	\N
5	5	\N	2026-05-13 16:28:09.384+00	2026-05-13 16:28:58.422+00	Present	\N	City of Kigali	2026-05-13 16:28:09.384+00	2026-05-13 16:28:58.423+00	f	\N
4	5	\N	2026-05-13 16:28:09.239+00	2026-05-13 16:29:03.002+00	Present	\N	City of Kigali	2026-05-13 16:28:09.239+00	2026-05-13 16:29:03.002+00	f	\N
6	5	\N	2026-05-13 16:30:35.515+00	2026-05-13 16:32:05.003+00	Present	\N	KG 644 Street, Gasabo District, City of Kigali [-1.95717,30.09435]	2026-05-13 16:30:35.516+00	2026-05-13 16:32:05.003+00	f	\N
7	5	\N	2026-05-13 16:33:18.601+00	2026-05-13 16:34:23.944+00	Present	\N	KG 644 Street, Gasabo District, City of Kigali [-1.95717,30.09435]	2026-05-13 16:33:18.603+00	2026-05-13 16:34:23.944+00	f	\N
8	5	\N	2026-05-13 16:35:01.098+00	2026-05-13 16:36:17.264+00	Present	\N	KG 644 Street, Gasabo District, City of Kigali [-1.95717,30.09435]	2026-05-13 16:35:01.099+00	2026-05-13 16:36:17.264+00	f	\N
9	5	\N	2026-05-13 16:36:32.333+00	2026-05-13 16:37:45.273+00	Present	\N	KG 644 Street, Rwanda Biomedical Center (RBC), Gasabo District, City of Kigali [-1.95717,30.09435]	2026-05-13 16:36:32.333+00	2026-05-13 16:37:45.274+00	f	\N
10	5	\N	2026-05-13 16:38:30.512+00	2026-05-13 16:39:07.389+00	Present	\N	KG 644 Street, Rwanda Biomedical Center (RBC), Gasabo District, City of Kigali [-1.95717,30.09435]	2026-05-13 16:38:30.513+00	2026-05-13 16:39:07.389+00	f	\N
11	5	\N	2026-05-13 16:40:43.271+00	2026-05-13 16:41:45.639+00	Present	\N	KG 644 Street, Rwanda Biomedical Center (RBC), Gasabo District, City of Kigali [-1.95717,30.09435]	2026-05-13 16:40:43.272+00	2026-05-13 16:41:45.639+00	f	\N
12	5	\N	2026-05-18 12:20:53.404+00	2026-05-18 12:21:48.949+00	Present	\N	KG 644 Street, Rwanda Biomedical Center (RBC), Gasabo District, City of Kigali [-1.95717,30.09435]	2026-05-18 12:20:53.408+00	2026-05-18 12:21:48.95+00	f	\N
13	5	\N	2026-05-28 13:05:45.287+00	2026-05-28 14:36:06.55+00	Present	\N	KG 644 Street, Rwanda Biomedical Center (RBC), Gasabo District, City of Kigali [-1.95717,30.094330000000003]	2026-05-28 13:05:45.301+00	2026-05-28 14:36:06.552+00	f	\N
14	5	\N	2026-05-31 17:18:38.002+00	2026-05-31 17:19:14.078+00	Present	\N	KG 230 Street, AUCA Masters Program, Gasabo District, City of Kigali [-1.9554250246736529,30.10449658664643]	2026-05-31 17:18:38.003+00	2026-05-31 17:19:14.078+00	f	\N
15	5	\N	2026-06-01 10:32:45.28+00	2026-06-06 15:37:28.339+00	Present	\N	-1.9502928,30.1259094	2026-06-01 10:32:45.422+00	2026-06-06 15:37:28.339+00	f	\N
16	10	\N	2026-06-26 14:40:20.26+00	\N	Present	\N	NR1, Volcan guest House, Kiyovu, Nyarugenge District, City of Kigali [-1.944,30.062]	2026-06-26 14:40:20.261+00	2026-06-26 14:40:20.261+00	f	\N
17	5	\N	2026-06-30 11:22:41.806+00	2026-06-30 11:23:31.323+00	Present	\N	KN 5 Road, AUCA Masters Program, Gasabo District, City of Kigali [-1.955422610336477,30.10447554748241]	2026-06-30 11:22:41.807+00	2026-06-30 11:23:31.324+00	f	\N
18	5	\N	2026-07-06 11:30:03.3+00	2026-07-06 11:32:20.628+00	Present	\N	Kibagabaga, Gasabo District, City of Kigali [-1.945922,30.125639]	2026-07-06 11:30:03.3+00	2026-07-06 11:32:20.628+00	f	\N
\.


--
-- Data for Name: BuyerRequests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BuyerRequests" (id, name, type, "contactPerson", email, phone, address, message, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Buyers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Buyers" (id, name, type, "contactPerson", email, phone, address, "createdAt", "updatedAt") FROM stdin;
2	Rwanda Agnecy Board	TV Channel	Umutoni Gaella	ishimweaugstin12@gmail.com	+25078923020399	Kigali	2026-05-22 15:37:11.412+00	2026-05-22 15:37:11.412+00
\.


--
-- Data for Name: Contracts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Contracts" (id, "contractNumber", terms, "expiryDate", "buyerId", "productionId", "filePath", status, "createdAt", "updatedAt") FROM stdin;
1	CT-1779470939587	Standard distribution agreement for 1.	2027-05-22 00:00:00+00	2	1	\N	Active	2026-05-22 17:28:59.587+00	2026-05-22 17:28:59.587+00
2	CT-1779901383174	Standard distribution agreement for 2.	2027-05-27 00:00:00+00	2	2	\N	Active	2026-05-27 17:03:03.179+00	2026-05-27 17:03:03.179+00
\.


--
-- Data for Name: Events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Events" (id, title, type, "startTime", "endTime", venue, "posterUrl", "productionId", description, "ticketPrice", "vipPrice", "vvipPrice", "tablePrice", status, "createdAt", "updatedAt") FROM stdin;
1	Luca in bk arena	Performance	2026-07-15 09:00:00+00	2026-07-15 13:00:00+00	bk arena	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/posters/poster-1780217893162-661987322.jpg	1	We expect a lot of audience	2000.00	10000.00	20000.00	150000.00	Scheduled	2026-05-09 09:17:30.718+00	2026-05-31 08:58:35.16+00
2	Turning red k-kigali	Performance	2026-08-20 11:00:00+00	2026-08-20 17:00:00+00	k-kigali	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/posters/poster-1780217995565-414733663.jpg	2	lanching 2th episode	3000.00	20000.00	40000.00	350000.00	Scheduled	2026-05-09 12:00:31.922+00	2026-05-31 09:00:55.382+00
3	Act-1	Rehearsal	2026-05-30 13:00:00+00	2026-05-30 19:00:00+00	Arena	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/posters/poster-1780218209314-279585543.jfif	2	The film is set on the Italian Riviera in the 1950s and centers on Luca Paguro, a young sea monster boy who can assume human form while on land. WikipediaAct One  Luca's Underwater World & First Steps on LandThe film opens beneath the sea, where Luca lives with his family herding fish. He is a curious but sheltered young sea monster whose parents strictly forbid him from going near the surface, warning him about the dangerous "land monsters" (humans) above.Ordinary boyhood conversations fill the first act — it's an intimate, contained story rather than a broad philosophical concept. Luca sneaks up to the surface and meets Alberto, a more adventurous and free-spirited sea monster who has been secretly living on an island above water. Alberto shows Luca how their bodies transform into human form when dry, which amazes and thrills Luca.	0.00	0.00	0.00	0.00	Scheduled	2026-05-29 12:57:32.006+00	2026-05-31 09:03:34.734+00
4	Silver Screen Gala	Performance	2026-08-01 22:38:00+00	2026-08-01 00:00:00+00	Grand Ballroom, Kigali Convention Centre	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/posters/poster-1780389665031-547866632.jpg	5	An elegant movie premiere event featuring a red-carpet reception, guest appearances, and the first public screening of the film.	10000.00	200000.00	400000.00	2000000.00	Scheduled	2026-06-02 08:42:28.184+00	2026-06-02 08:42:28.184+00
5	Cinematic Dreams Night	Performance	2026-08-20 14:00:00+00	2026-08-20 18:40:00+00	Rooftop Garden, Kigali Heights	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/posters/poster-1780389904269-152704338.jpg	1	A celebration of creativity and storytelling, including film screenings, networking sessions, and discussions with filmmakers.	1000.00	10000.00	100000.00	1000000.00	Scheduled	2026-06-02 08:45:22.66+00	2026-06-02 08:45:22.66+00
6	Lights, Camera, Legacy	Performance	2026-06-10 12:00:00+00	2026-06-10 19:00:00+00	Main Auditorium, Kigali Conference and Exhibition Village	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/posters/poster-1780390080355-652711159.jpg	2	A prestigious event honoring cinematic achievements with award presentations, special performances, and an exclusive movie showcase.	20000.00	200000.00	300000.00	20000000.00	Scheduled	2026-06-02 08:48:15.843+00	2026-06-02 08:48:15.843+00
\.


--
-- Data for Name: Expenses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Expenses" (id, amount, category, description, "productionId", date, "createdAt", "updatedAt") FROM stdin;
1	3000.00	Equipment	Camera	5	2026-07-06 00:00:00+00	2026-07-06 18:57:39.241+00	2026-07-06 18:57:39.241+00
\.


--
-- Data for Name: MediaFiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MediaFiles" (id, "fileName", "filePath", "fileType", format, category, "productionId", "isPublic", season, "episodeNumber", description, "metaData", "createdAt", "updatedAt") FROM stdin;
5	Luca(2026) - Trailer	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1778944004719-10351226.webm	Trailer	WEBM	Drama	1	t	1	1	He empties dustbins. She fills ballrooms. Their worlds could not be more different until the morning fate placed them in the same street, at the same moment, and love did what love always does: it ignored every rule. This is the story of two people who found gold in the most unlikely place  in each other.	\N	2026-05-10 11:16:16.464+00	2026-06-06 15:55:22.729+00
10	Turning red - Poster	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1780761293091-305040951.png	Poster	PNG	Commedy	2	t	\N	\N	Turning red	\N	2026-05-16 16:10:52.945+00	2026-06-06 15:54:58.52+00
12	Turning red - Trailer	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1778947850937-251922325.webm	Trailer	WEBM	Commedy	2	t	\N	\N	Turning red	\N	2026-05-16 16:10:52.959+00	2026-06-06 15:54:58.52+00
11	Turning red	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1778947841070-782116473.webm	Full Movie	WEBM	Commedy	2	t	1	1	Turning red	\N	2026-05-16 16:10:52.95+00	2026-06-06 15:54:58.52+00
15	12 Rules of life	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1780234948627-657214307.webm	Full Movie	WEBM	Documentary	6	t	1	1	Talk about life	\N	2026-05-31 13:43:52.987+00	2026-05-31 13:46:57.419+00
13	12 Rules of life - Poster	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1780234980856-111352224.png	Poster	PNG	Documentary	6	t	\N	\N	Talk about life	\N	2026-05-31 13:43:52.866+00	2026-05-31 13:46:57.419+00
14	12 Rules of life - Trailer	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1780235011918-79471544.webm	Trailer	WEBM	Documentary	6	t	\N	\N	Talk about life	\N	2026-05-31 13:43:52.88+00	2026-05-31 13:46:57.419+00
6	Luca(2026)	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1778945864930-539485986.webm	Episode	WEBM	Drama	1	t	1	1	He empties dustbins. She fills ballrooms. Their worlds could not be more different until the morning fate placed them in the same street, at the same moment, and love did what love always does: it ignored every rule. This is the story of two people who found gold in the most unlikely place  in each other.	\N	2026-05-10 11:16:16.464+00	2026-06-06 15:55:22.729+00
9	Luca(2026)	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1778945908537-286429458.webm	Episode	WEBM	Drama	1	t	1	2	He empties dustbins. She fills ballrooms. Their worlds could not be more different until the morning fate placed them in the same street, at the same moment, and love did what love always does: it ignored every rule. This is the story of two people who found gold in the most unlikely place  in each other.	\N	2026-05-16 15:38:37.312+00	2026-06-06 15:55:22.729+00
4	Luca(2026) - Poster	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1780761317579-98074298.png	Poster	PNG	Drama	1	t	1	1	He empties dustbins. She fills ballrooms. Their worlds could not be more different until the morning fate placed them in the same street, at the same moment, and love did what love always does: it ignored every rule. This is the story of two people who found gold in the most unlikely place  in each other.	\N	2026-05-10 11:16:16.464+00	2026-06-06 15:55:22.729+00
\.


--
-- Data for Name: MediaInteractions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MediaInteractions" (id, "userId", "mediaId", type, "createdAt", "updatedAt") FROM stdin;
2	9	11	like	2026-05-22 18:29:08.507+00	2026-05-22 18:29:08.507+00
3	9	9	like	2026-05-27 09:26:34.286+00	2026-05-27 09:26:34.286+00
5	6	6	like	2026-05-27 17:19:44.21+00	2026-05-27 17:19:44.21+00
6	9	15	like	2026-05-31 13:52:14.79+00	2026-05-31 13:52:14.79+00
\.


--
-- Data for Name: Notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notifications" (id, "userId", title, message, type, "isRead", "createdAt", "updatedAt") FROM stdin;
1	4	New License Request	"Rwanda Agnecy Board" has requested a distribution license for "Luca(2026)".	license_request	f	2026-05-22 17:23:24.886+00	2026-05-22 17:23:24.886+00
2	10	New License Request	"Rwanda Agnecy Board" has requested a distribution license for "Luca(2026)".	license_request	f	2026-05-22 17:23:24.886+00	2026-05-22 17:23:24.886+00
3	6	License Request Approved	Your distribution license request for "Luca(2026)" has been approved!	license_approval	f	2026-05-22 17:28:59.693+00	2026-05-22 17:28:59.693+00
4	10	New License Request	"Rwanda Agnecy Board" has requested a distribution license for "Turning red".	license_request	f	2026-05-27 15:59:19.101+00	2026-05-27 15:59:19.101+00
7	6	License Price Quoted	A distribution license price of 500,000 RWF has been set for "Turning red". Complete checkout to unlock.	license_pricing	f	2026-05-27 16:14:06.749+00	2026-05-27 16:14:06.749+00
8	6	License Request Approved	Your distribution license request for "Turning red" has been approved!	license_approval	f	2026-05-27 17:03:03.341+00	2026-05-27 17:03:03.341+00
9	4	New License Request	"A partner" has requested a distribution license for "Luca(2026)".	license_request	f	2026-05-27 18:25:37.68+00	2026-05-27 18:25:37.68+00
10	10	New License Request	"A partner" has requested a distribution license for "Luca(2026)".	license_request	f	2026-05-27 18:25:37.681+00	2026-05-27 18:25:37.681+00
11	4	New License Request	"A partner" has requested a distribution license for "Turning red".	license_request	f	2026-05-27 19:09:33.411+00	2026-05-27 19:09:33.411+00
12	10	New License Request	"A partner" has requested a distribution license for "Turning red".	license_request	f	2026-05-27 19:09:33.412+00	2026-05-27 19:09:33.412+00
13	12	New Movie Available	"Alberto movie" is now available in the catalog for distribution licensing!	new_movie	f	2026-05-31 09:17:09.413+00	2026-05-31 09:17:09.413+00
14	6	New Movie Available	"Alberto movie" is now available in the catalog for distribution licensing!	new_movie	f	2026-05-31 09:17:09.414+00	2026-05-31 09:17:09.414+00
15	12	New Movie Available	"Theater" is now available in the catalog for distribution licensing!	new_movie	f	2026-05-31 10:30:17.116+00	2026-05-31 10:30:17.116+00
16	6	New Movie Available	"Theater" is now available in the catalog for distribution licensing!	new_movie	f	2026-05-31 10:30:17.116+00	2026-05-31 10:30:17.116+00
17	12	New Movie Available	"12 Rules of life" is now available in the catalog for distribution licensing!	new_movie	f	2026-05-31 13:03:47.449+00	2026-05-31 13:03:47.449+00
18	6	New Movie Available	"12 Rules of life" is now available in the catalog for distribution licensing!	new_movie	f	2026-05-31 13:03:47.449+00	2026-05-31 13:03:47.449+00
19	10	New License Request	"Rwanda Agnecy Board" has requested a distribution license for "12 Rules of life".	license_request	f	2026-07-06 19:41:35.632+00	2026-07-06 19:41:35.632+00
5	4	New License Request	"Rwanda Agnecy Board" has requested a distribution license for "Turning red".	license_request	t	2026-05-27 15:59:19.101+00	2026-07-06 19:42:33.66+00
20	4	New License Request	"Rwanda Agnecy Board" has requested a distribution license for "12 Rules of life".	license_request	t	2026-07-06 19:41:35.632+00	2026-07-06 19:42:38.066+00
21	6	License Request Rejected	Your distribution license request for "12 Rules of life" has been rejected.	license_rejection	f	2026-07-06 19:44:21.989+00	2026-07-06 19:44:21.989+00
\.


--
-- Data for Name: PendingUsers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PendingUsers" (id, "firstName", "lastName", email, password, "roleId", "verifyCode", "expiresAt", "createdAt", "updatedAt") FROM stdin;
11	Test	User	test12345@example.com	$2b$10$T5vWeo0z8pgDzd7nw88nJOP/3/nfoakxO1Gc0NsTcvx.0XTrm9pEO	6	823924	2026-05-31 14:12:04.225+00	2026-05-31 14:02:04.227+00	2026-05-31 14:02:04.227+00
12	ishimwe	Patience	dondoware13@gmail.com	$2b$10$U2a9VEx51JPQiGhRHhe/denTZM/hoyBy5EINamj1J.XD07QfA6RrG	6	137633	2026-05-31 14:17:29.139+00	2026-05-31 14:07:29.141+00	2026-05-31 14:07:29.141+00
13	Agape	Mugisha	mugishaagape1@gmail.com	$2b$10$saABD5A0quwfX9a2X3tmFO6Mip4puqWE7rSF0n6/DvF4EjCCS1j/y	6	383057	2026-06-07 12:09:21.736+00	2026-06-07 11:59:21.736+00	2026-06-07 11:59:21.736+00
\.


--
-- Data for Name: ProductionCategories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductionCategories" (id, name, description, "createdAt", "updatedAt") FROM stdin;
1	Movie	Film productions	2026-05-08 11:55:32.31+00	2026-05-08 11:55:32.31+00
2	Theatre	Stage plays and drama	2026-05-08 11:55:32.31+00	2026-05-08 11:55:32.31+00
3	Radio Drama	Audio productions	2026-05-08 11:55:32.31+00	2026-05-08 11:55:32.31+00
4	Journal/Paper	Academic or creative writing	2026-05-08 11:55:32.31+00	2026-05-08 11:55:32.31+00
5	Script	Stand-alone scripts	2026-05-08 11:55:32.31+00	2026-05-08 11:55:32.31+00
\.


--
-- Data for Name: ProductionTalents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductionTalents" ("createdAt", "updatedAt", "productionId", "talentId") FROM stdin;
2026-05-31 12:08:52.625+00	2026-05-31 12:08:52.625+00	1	2
2026-05-31 12:09:22.268+00	2026-05-31 12:09:22.268+00	2	1
2026-05-31 13:04:53.834+00	2026-05-31 13:04:53.834+00	6	2
2026-05-31 17:05:56.011+00	2026-05-31 17:05:56.011+00	1	3
\.


--
-- Data for Name: Productions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Productions" (id, title, description, genre, language, duration, budget, "releaseDate", status, type, "categoryId", "directorId", "posterUrl", "createdAt", "updatedAt") FROM stdin;
5	Theater	drama	drama	Kinyarwanda		100.00	2027-02-01 00:00:00+00	Draft	Theatre	2	\N	\N	2026-05-31 10:30:16.756+00	2026-05-31 10:30:16.756+00
6	12 Rules of life	Talk about life	Documentary	English		1000000.00	2026-06-03 00:00:00+00	Draft	Movie	1	\N	\N	2026-05-31 13:03:47.067+00	2026-05-31 13:46:57.539+00
2	Turning red	Turning red	Catoon	English		20000000.00	2026-05-16 00:00:00+00	Draft	Movie	1	\N	\N	2026-05-16 16:10:13.926+00	2026-06-06 15:54:58.64+00
1	Luca(2026)	He empties dustbins. She fills ballrooms. Their worlds could not be more different until the morning fate placed them in the same street, at the same moment, and love did what love always does: it ignored every rule. This is the story of two people who found gold in the most unlikely place  in each other.	Drama	Kinyarwanda		10000000.00	2026-12-09 00:00:00+00	Draft	Series	1	\N	\N	2026-05-08 13:40:06.981+00	2026-06-06 15:55:22.85+00
\.


--
-- Data for Name: Revenues; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Revenues" (id, amount, source, "productionId", date, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Roles" (id, name, description, "createdAt", "updatedAt") FROM stdin;
1	Admin	System Administrator	2026-05-08 11:55:32.297+00	2026-05-08 11:55:32.297+00
2	Production Manager	Manages productions and schedules	2026-05-08 11:55:32.297+00	2026-05-08 11:55:32.297+00
3	Finance Officer	Manages budgets and expenses	2026-05-08 11:55:32.297+00	2026-05-08 11:55:32.297+00
4	Writer/Director	Manages scripts and creative direction	2026-05-08 11:55:32.297+00	2026-05-08 11:55:32.297+00
5	Actor/Talent	Participates in productions	2026-05-08 11:55:32.297+00	2026-05-08 11:55:32.297+00
6	Public Visitor	Website user	2026-05-08 11:55:32.297+00	2026-05-08 11:55:32.297+00
7	Partner	Business partner or external collaborator	2026-05-13 21:00:38.014+00	2026-05-13 21:00:38.014+00
8	Buyer	Interested buyer of productions	2026-05-13 21:00:38.106+00	2026-05-13 21:00:38.106+00
\.


--
-- Data for Name: Sales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Sales" (id, amount, "paymentStatus", "saleType", "contractId", "productionId", "buyerId", "buyerName", "buyerEmail", "ticketTier", "ticketQuantity", date, "expiryDate", "createdAt", "updatedAt") FROM stdin;
4	0.00	Paid	Licensing	1	1	2	\N	\N	\N	1	2026-05-22 00:00:00+00	2027-05-22 00:00:00+00	2026-05-22 17:23:24.87+00	2026-05-22 17:28:59.651+00
5	500000.00	Paid	Licensing	2	2	2	\N	\N	\N	1	2026-05-27 00:00:00+00	2027-05-27 00:00:00+00	2026-05-27 15:59:19.073+00	2026-05-27 17:03:03.29+00
6	2000.00	Paid	Theatre ticket sales	\N	1	\N	IshimwePatience	ishimwepatience102@gmail.com	regular	1	2026-05-27 00:00:00+00	\N	2026-05-27 18:25:36.942+00	2026-05-27 18:25:36.942+00
7	700000.00	Paid	Theatre ticket sales	\N	2	\N	Umutoni Gaella	lanalysley@gmail.com	table	2	2026-05-27 00:00:00+00	\N	2026-05-27 19:09:31.734+00	2026-05-27 19:09:31.734+00
8	3000.00	Paid	Theatre ticket sales	\N	1	\N	\N	\N	\N	1	2026-05-27 00:00:00+00	\N	2026-05-27 19:15:50.272+00	2026-05-27 19:15:50.272+00
9	10000.00	Paid	Theatre ticket sales	\N	1	\N	\N	\N	\N	1	2026-06-23 00:00:00+00	\N	2026-06-23 11:53:08.055+00	2026-06-23 11:53:08.055+00
\.


--
-- Data for Name: ScriptAssignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ScriptAssignments" ("createdAt", "updatedAt", "scriptId", "talentId") FROM stdin;
2026-05-13 14:46:21.083+00	2026-05-13 14:46:21.083+00	1	1
2026-05-30 19:26:44.196+00	2026-05-30 19:26:44.196+00	2	1
\.


--
-- Data for Name: Scripts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Scripts" (id, title, version, "filePath", "fileType", status, "productionId", "authorId", "copyrightInfo", "createdAt", "updatedAt", "aiReview") FROM stdin;
2	luca	1.0	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/scripts/file-1780169173859-494760800.pdf	PDF	Approved	1	\N	This is our own property never share it	2026-05-30 19:26:43.056+00	2026-07-06 13:25:19.759+00	{"tone":"The excerpt has an academic, formal, and highly technical tone, characteristic of an internship report or a technical documentation. It is informative and structured around software development concepts, technologies, and project outcomes. This tone is entirely incongruous with the intended genre of 'Drama' and the romantic narrative described in the production context. There is no emotional depth, dialogue, or narrative development typical of a drama.","audience_fit":"This excerpt is completely unsuitable for an audience expecting a romantic drama about love transcending social barriers. The content is an internship report focused on software engineering, Spring Boot, React.js, and database technologies. Its target audience would be academic supervisors, technical professionals, or anyone interested in software development internships, not a general audience seeking a dramatic story. It fails to meet any expectation set by the production details provided.","characters":[{"name":"Umutoni Gaella","description":"The student intern who submitted the report. Described as diligent and capable, having successfully completed tasks like system analysis, development of IT solutions, troubleshooting, and deployment of software projects. The report details their learning journey and technical achievements."},{"name":"Mugisha Elvis","description":"The internship supervisor. Confirmed to have guided and mentored Umutoni Gaella and certified the successful completion of the industrial training program. Plays a supporting, supervisory role in the context of the report."}],"feedback":"This submitted excerpt is not a script for a movie or play, but rather a technical internship report. As such, it cannot be analyzed effectively against the context of a romantic drama genre. The content is well-structured and detailed for an internship report, clearly outlining the project, technologies used, and learning outcomes, which would be excellent if the request was to review a technical document. However, it completely misses the mark for a 'script excerpt' intended for a 'Drama' genre. There are no dramatic elements, character interactions, or narrative progression suitable for a cinematic or theatrical production. It's a fundamental mismatch between the provided content and the requested analysis parameters."}
1	Jack Black	1.0	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/scripts/file-1780218314733-813302277.pdf	PDF	Draft	1	\N	Ishya propert only no one else to see	2026-05-13 14:46:21.018+00	2026-06-04 12:58:34.379+00	{"tone":"The tone is purely instructional, factual, and procedural. It is entirely unsuited for the intended genre of Drama, which would require an emotional, narrative, or character-driven tone.","audience_fit":"This text is a technical guide for registering for an AI training course, aimed at individuals seeking to enroll in such programs. It bears no resemblance to a script for a drama about two disparate individuals finding love and therefore does not fit the described target audience for the production at all.","characters":[],"feedback":"The provided text is not a movie/play script excerpt. It is a detailed guide for registering for AI training courses and managing digital credentials. As such, it contains no dramatic elements, characters, dialogue, or narrative appropriate for analysis within the context of a 'Drama' genre production. It cannot be critiqued as a script."}
\.


--
-- Data for Name: SystemSettings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SystemSettings" (id, key, value, "createdAt", "updatedAt") FROM stdin;
1	public_monthly_subscription_price	10000	2026-05-30 15:22:27.349+00	2026-05-30 15:22:27.349+00
\.


--
-- Data for Name: Talents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Talents" (id, "firstName", "lastName", email, phone, specialty, skills, bio, "profilePic", "userId", availability, "portfolioUrl", "socialLinks", "createdAt", "updatedAt") FROM stdin;
2	Umutoni	Keza	pomleo949@gmail.com	0787766431	Actress			https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1779109221802-74673290.png	\N	t	\N	\N	2026-05-18 13:03:54.124+00	2026-05-18 13:03:54.124+00
1	Umutoni	Gaella	ishimwepatience102@gmail.com	0783202922	Make-up Artist	singing		https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1778681014133-713830233.jpg	5	t	\N	\N	2026-05-08 14:01:28.248+00	2026-05-31 12:09:22.022+00
3	ABATONI	KEZA	Lanalysley@gmail.com	0787766431	Actor				\N	t	\N	\N	2026-05-31 17:05:55.746+00	2026-05-31 17:05:55.746+00
\.


--
-- Data for Name: UserPreferences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserPreferences" (id, "userId", "pageKey", "zoomLevel", "viewMode", "createdAt", "updatedAt") FROM stdin;
193	4	talents	48	grid	2026-05-15 09:36:18.025+00	2026-06-04 12:06:55.886+00
215	5	actor-schedule	86	grid	2026-05-29 13:23:05.806+00	2026-07-02 13:11:00.343+00
202	10	productions	100	list	2026-05-18 14:37:27.222+00	2026-07-02 13:15:57.211+00
61	6	media-library	50	grid	2026-05-15 09:33:49.962+00	2026-07-06 19:40:30.363+00
214	5	dashboard	100	grid	2026-05-29 12:29:08.572+00	2026-05-29 13:20:02.28+00
201	10	talents	100	grid	2026-05-18 13:04:25.604+00	2026-05-18 13:04:40.252+00
197	9	dashboard	62	grid	2026-05-16 11:11:22.657+00	2026-05-16 11:11:27.586+00
194	4	dashboard	53	grid	2026-05-15 09:39:29.295+00	2026-06-04 14:50:14.865+00
210	10	media-library	48	grid	2026-05-18 15:55:57.75+00	2026-05-31 13:54:24.023+00
218	4	scripts	55	grid	2026-05-30 17:58:43.866+00	2026-06-02 08:15:18.31+00
1	6	my-library	20	grid	2026-05-15 09:33:36.588+00	2026-05-31 16:44:25.611+00
191	4	productions	52	grid	2026-05-15 09:35:13.188+00	2026-06-02 08:17:51.491+00
192	4	media-library	43	grid	2026-05-15 09:35:23.476+00	2026-06-06 15:32:52.124+00
219	10	dashboard	39	list	2026-06-26 13:50:42.455+00	2026-06-26 13:50:59.603+00
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Users" (id, "firstName", "lastName", email, password, "roleId", "googleId", "profilePic", phone, "buyerId", status, "resetPasswordToken", "resetPasswordExpires", "twoFactorCode", "twoFactorExpires", "isTwoFactorEnabled", "isVerified", "emailVerifyCode", "emailVerifyExpires", "subscriptionStatus", "subscriptionExpiresAt", "notificationPrefs", "createdAt", "updatedAt", theme) FROM stdin;
11	Umutoni	Gaella	lanalysley@gmail.com	$2b$10$ZUUkczbsEWFaw9OzzYfdwuFNAVLaGRZJD7m1dap/DpYFsv3czKO52	6	\N	\N	\N	\N	active	\N	\N	\N	\N	f	t	\N	\N	inactive	\N	{"emailAlerts": true, "browserAlerts": true, "marketingEmails": false, "troubleshootingAlerts": true}	2026-05-18 12:53:38.796+00	2026-05-18 12:53:38.796+00	dark
12	Abatoni	Keza	jeankubera0@gmail.com	$2b$10$izB7h0OUXI9KoLYCq7Fq7esfsq/s6ncioPup0vKP9dqpuSvbiTd7i	7	\N	\N	\N	\N	active	\N	\N	\N	\N	f	t	\N	\N	inactive	\N	{"emailAlerts": true, "browserAlerts": true, "marketingEmails": false, "troubleshootingAlerts": true}	2026-05-18 13:12:27.118+00	2026-05-18 15:47:31.147+00	dark
10	Umutoni	Gaella	Umutonigaella70@gmail.com	$2b$10$hBO0b5EUx9cqzNeZr0v5J.wqHkuCJJH6H3pUxoZ9yK8yVwFSyUGcS	1	\N	\N	\N	\N	active	\N	\N	\N	\N	f	t	\N	\N	inactive	\N	{"emailAlerts": true, "browserAlerts": true, "marketingEmails": false, "troubleshootingAlerts": true}	2026-05-18 12:49:17.567+00	2026-07-06 11:03:59.202+00	light
9	ishimwe	patience	dukundanepaccy00@gmail.com	$2b$10$MlLUOTrucjGaSzevKNhiEOTgb7y5Z/9KM5RlyPhN4AyIpNE5L/RZe	6	\N	\N	\N	\N	active	123653	2026-05-30 18:35:50.498+00	\N	\N	f	t	\N	\N	active	2026-07-26 19:15:50.226+00	{"emailAlerts": true, "browserAlerts": true, "marketingEmails": false, "troubleshootingAlerts": true}	2026-05-16 09:44:45.659+00	2026-07-06 11:42:00.867+00	light
5	Umutoni	Gaella	ishimwepatience102@gmail.com	$2b$10$sdlAWqQ6FxPjpBoc4EQ.jeWfx7BwB7ywA5eOIGeCk8IDi/MlEDWj6	5	\N	\N	\N	\N	active	222357	2026-05-30 19:07:55.254+00	\N	\N	f	t	\N	\N	inactive	\N	{"emailAlerts": true, "browserAlerts": true, "marketingEmails": false, "troubleshootingAlerts": true}	2026-05-13 15:20:41.684+00	2026-07-06 18:35:46.651+00	dark
6	ishimwe	Patience	ishimweaugstin12@gmail.com	$2b$10$N9YqUwzuoD.UFdLgszniVOs77MhaadZkBOvv2/0xxAvaX3VkjUBUS	7	\N	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1779902858460-658703916.jfif		2	active	\N	\N	\N	\N	f	t	\N	\N	inactive	\N	{"emailAlerts": true, "browserAlerts": true, "marketingEmails": false, "troubleshootingAlerts": true}	2026-05-13 21:06:13.562+00	2026-07-06 18:37:10.116+00	dark
4	Umutoni	Gaella	ishimweraymo@gmail.com	$2b$10$iPv/wAQfRZRljx2zqdsyaOOg1CtE7cmNBrBJJNFe12djmSOy8N2Ri	1	\N	https://twqeninkntadpjtelisj.supabase.co/storage/v1/object/public/ishya-uploads/media/file-1779538215052-641146619.png		\N	active	\N	\N	962080	2026-05-31 11:20:32.265+00	t	t	\N	\N	inactive	\N	{"emailAlerts": true, "browserAlerts": true, "marketingEmails": false, "troubleshootingAlerts": true}	2026-05-08 12:08:51.783+00	2026-06-30 14:08:52.742+00	dark
\.


--
-- Data for Name: WatchProgresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."WatchProgresses" (id, "userId", "mediaId", "productionId", "currentTime", duration, "isFinished", "lastWatched", "createdAt", "updatedAt") FROM stdin;
4	4	9	1	192.427006	239.088	f	2026-05-16 15:40:40.351+00	2026-05-16 15:38:50.357+00	2026-05-16 15:40:40.351+00
8	12	5	1	9.138849	145.508	f	2026-05-18 14:56:04.881+00	2026-05-18 14:55:59.952+00	2026-05-18 14:56:04.882+00
9	6	11	2	4.647567	85.828	f	2026-05-27 17:19:25.627+00	2026-05-27 17:19:25.628+00	2026-05-27 17:19:25.628+00
10	6	6	1	4.872753	63.608	f	2026-05-27 17:19:45.645+00	2026-05-27 17:19:45.646+00	2026-05-27 17:19:45.646+00
5	9	9	1	239.088	239.088	t	2026-05-27 19:20:12.516+00	2026-05-16 15:43:11.706+00	2026-05-27 19:20:12.516+00
11	4	6	1	23.750228	63.608	f	2026-05-30 18:33:02.949+00	2026-05-30 16:59:12.872+00	2026-05-30 18:33:02.949+00
12	4	11	2	16.718344	85.828	f	2026-06-01 16:12:23.236+00	2026-05-30 18:01:03.511+00	2026-06-01 16:12:23.236+00
17	4	14	6	9.116077	103.928	f	2026-06-04 13:53:10.058+00	2026-06-04 13:52:59.956+00	2026-06-04 13:53:10.058+00
15	9	15	6	132.828	132.828	t	2026-06-06 16:46:10.512+00	2026-05-31 13:47:36.277+00	2026-06-06 16:46:10.512+00
14	10	11	2	7.826062	85.828	f	2026-05-30 19:55:56.732+00	2026-05-30 19:55:54.514+00	2026-05-30 19:55:56.732+00
18	4	5	1	4.547975	145.508	f	2026-06-07 11:51:27.457+00	2026-06-07 11:51:23.044+00	2026-06-07 11:51:27.458+00
13	4	12	2	2.355213	144.508	f	2026-06-30 13:38:30.722+00	2026-05-30 18:02:57.163+00	2026-06-30 13:38:30.723+00
19	10	15	6	2.750263	132.828	f	2026-07-02 13:16:36.871+00	2026-07-02 13:16:36.871+00	2026-07-02 13:16:36.871+00
7	9	11	2	4.411972	85.828	f	2026-07-02 13:27:37.835+00	2026-05-16 16:18:29.695+00	2026-07-02 13:27:37.835+00
6	6	5	1	9.225018	145.508	f	2026-05-31 10:22:25.921+00	2026-05-16 15:46:44.092+00	2026-05-31 10:22:25.921+00
1	9	6	1	63.608	63.608	t	2026-05-31 11:22:57.603+00	2026-05-16 13:23:44.4+00	2026-05-31 11:22:57.603+00
16	6	14	6	2.187546	103.928	f	2026-05-31 13:51:57.499+00	2026-05-31 13:51:57.499+00	2026-05-31 13:51:57.499+00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-05-30 09:52:18
20211116045059	2026-05-30 09:52:18
20211116050929	2026-05-30 09:52:18
20211116051442	2026-05-30 09:52:18
20211116212300	2026-05-30 09:52:18
20211116213355	2026-05-30 09:52:18
20211116213934	2026-05-30 09:52:18
20211116214523	2026-05-30 09:52:18
20211122062447	2026-05-30 09:52:18
20211124070109	2026-05-30 09:52:18
20211202204204	2026-05-30 09:52:18
20211202204605	2026-05-30 09:52:18
20211210212804	2026-05-30 09:52:18
20211228014915	2026-05-30 09:52:18
20220107221237	2026-05-30 09:52:18
20220228202821	2026-05-30 09:52:18
20220312004840	2026-05-30 09:52:18
20220603231003	2026-05-30 13:01:17
20220603232444	2026-05-30 13:01:17
20220615214548	2026-05-30 13:01:17
20220712093339	2026-05-30 13:01:17
20220908172859	2026-05-30 13:01:17
20220916233421	2026-05-30 13:01:17
20230119133233	2026-05-30 13:01:17
20230128025114	2026-05-30 13:01:17
20230128025212	2026-05-30 13:01:17
20230227211149	2026-05-30 13:01:17
20230228184745	2026-05-30 13:01:17
20230308225145	2026-05-30 13:01:17
20230328144023	2026-05-30 13:01:17
20231018144023	2026-05-30 13:01:17
20231204144023	2026-05-30 13:01:17
20231204144024	2026-05-30 13:01:17
20231204144025	2026-05-30 13:01:17
20240108234812	2026-05-30 13:01:17
20240109165339	2026-05-30 13:01:17
20240227174441	2026-05-30 13:01:17
20240311171622	2026-05-30 13:01:17
20240321100241	2026-05-30 13:01:17
20240401105812	2026-05-30 13:01:17
20240418121054	2026-05-30 13:01:17
20240523004032	2026-05-30 13:01:17
20240618124746	2026-05-30 13:01:17
20240801235015	2026-05-30 13:01:17
20240805133720	2026-05-30 13:01:17
20240827160934	2026-05-30 13:01:17
20240919163303	2026-05-30 13:01:17
20240919163305	2026-05-30 13:01:17
20241019105805	2026-05-30 13:01:17
20241030150047	2026-05-30 13:01:17
20241108114728	2026-05-30 13:01:17
20241121104152	2026-05-30 13:01:17
20241130184212	2026-05-30 13:01:17
20241220035512	2026-05-30 13:01:17
20241220123912	2026-05-30 13:01:17
20241224161212	2026-05-30 13:01:17
20250107150512	2026-05-30 13:01:17
20250110162412	2026-05-30 13:01:17
20250123174212	2026-05-30 13:01:17
20250128220012	2026-05-30 13:01:17
20250506224012	2026-05-30 13:01:17
20250523164012	2026-05-30 13:01:17
20250714121412	2026-05-30 13:01:17
20250905041441	2026-05-30 13:01:17
20251103001201	2026-05-30 13:01:17
20251120212548	2026-05-30 13:01:17
20251120215549	2026-05-30 13:01:17
20260218120000	2026-05-30 13:01:17
20260326120000	2026-05-30 13:01:17
20260514120000	2026-07-06 19:51:49
20260527120000	2026-07-06 19:51:49
20260528120000	2026-07-06 19:51:49
20260603120000	2026-07-06 19:51:49
20260605120000	2026-07-06 19:51:49
20260606110000	2026-07-06 19:51:49
20260616120000	2026-07-06 19:51:49
20260624120000	2026-07-06 19:51:49
20260626120000	2026-07-06 19:51:49
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter, selected_columns) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
ishya-uploads	ishya-uploads	\N	2026-05-30 17:18:33.516876+00	2026-05-30 17:18:33.516876+00	t	f	\N	\N	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-05-30 09:52:44.301883
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-05-30 09:52:44.347751
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-05-30 09:52:44.35149
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-05-30 09:52:44.3735
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-05-30 09:52:44.386576
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-05-30 09:52:44.38895
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-05-30 09:52:44.392019
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-05-30 09:52:44.394838
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-05-30 09:52:44.397362
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-05-30 09:52:44.399859
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-05-30 09:52:44.402543
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-05-30 09:52:44.406482
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-05-30 09:52:44.409588
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-05-30 09:52:44.414799
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-05-30 09:52:44.41766
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-05-30 09:52:44.442148
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-05-30 09:52:44.444784
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-05-30 09:52:44.44756
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-05-30 09:52:44.450228
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-05-30 09:52:44.454309
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-05-30 09:52:44.457071
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-05-30 09:52:44.461644
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-05-30 09:52:44.473879
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-05-30 09:52:44.48157
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-05-30 09:52:44.484224
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-05-30 09:52:44.48674
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-05-30 09:52:44.489462
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-05-30 09:52:44.491632
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-05-30 09:52:44.493791
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-05-30 09:52:44.495955
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-05-30 09:52:44.498144
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-05-30 09:52:44.500398
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-05-30 09:52:44.5026
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-05-30 09:52:44.505009
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-05-30 09:52:44.507208
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-05-30 09:52:44.509389
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-05-30 09:52:44.511598
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-05-30 09:52:44.51372
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-05-30 09:52:44.516763
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-05-30 09:52:44.526496
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-05-30 09:52:44.528615
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-05-30 09:52:44.530864
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-05-30 09:52:44.533832
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-05-30 09:52:44.536143
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-05-30 09:52:44.539626
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-05-30 09:52:44.543602
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-05-30 09:52:44.5527
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-05-30 09:52:44.555783
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-05-30 09:52:44.558101
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-05-30 09:52:44.573184
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-05-30 09:52:44.576171
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-05-30 09:52:45.381906
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-05-30 09:52:45.383398
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-05-30 09:52:45.390873
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-05-30 09:52:45.392829
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-05-30 09:52:45.394265
56	fix-optimized-search-function	b823ed1e418101032fa01374edc9a436e54e3ed4	2026-05-30 09:52:45.3977
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-05-30 09:52:45.402139
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-05-30 09:52:45.404763
59	drop-unused-functions	38456f13e39691c2bbb4b5151d0d1cdbabd4a8c4	2026-05-30 09:52:45.408158
60	optimize-existing-functions-again	db35e1c91a9201e59f4fef8d972c2f277d68b157	2026-05-30 09:52:45.411006
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
568a6b4e-af56-4472-87f1-578a4335d1f1	ishya-uploads	media/file-1778350678087-884475898.jpg	\N	2026-05-30 17:21:17.588148+00	2026-05-30 17:21:17.588148+00	2026-05-30 17:21:17.588148+00	{"eTag": "\\"4023904e71b725cb12ade1272313824f\\"", "size": 80491, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:21:18.000Z", "contentLength": 80491, "httpStatusCode": 200}	ad7044fc-8c60-4293-b944-5870c0fa9b34	\N	{}
eb11ab72-afbb-45a0-ab5d-299640830ac3	ishya-uploads	media/file-1778350701986-305171203.mp4	\N	2026-05-30 17:21:29.002377+00	2026-05-30 17:21:29.002377+00	2026-05-30 17:21:29.002377+00	{"eTag": "\\"bc16480d19cbb28295f6e7807994a256-3\\"", "size": 14672196, "mimetype": "video/mp4", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:21:29.000Z", "contentLength": 14672196, "httpStatusCode": 200}	51e48094-b33c-4dc9-ab89-5fcfbba48b8d	\N	{}
8c01b7c5-ff5a-41a2-b66c-85fff6d679e4	ishya-uploads	media/file-1778411735312-479272224.jpg	\N	2026-05-30 17:22:50.45521+00	2026-05-30 17:22:50.45521+00	2026-05-30 17:22:50.45521+00	{"eTag": "\\"4023904e71b725cb12ade1272313824f\\"", "size": 80491, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:22:51.000Z", "contentLength": 80491, "httpStatusCode": 200}	9d2be999-0a77-4b05-b418-22057c718924	\N	{}
9ff6c54a-1f18-4cc9-bae3-43d24ec544a8	ishya-uploads	media/file-1778411756708-227384667.mp4	\N	2026-05-30 17:23:02.642391+00	2026-05-30 17:23:02.642391+00	2026-05-30 17:23:02.642391+00	{"eTag": "\\"bc16480d19cbb28295f6e7807994a256-3\\"", "size": 14672196, "mimetype": "video/mp4", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:23:02.000Z", "contentLength": 14672196, "httpStatusCode": 200}	acca30cb-c5cf-4e2f-b14f-bc0fd252f2ff	\N	{}
efd8d853-5f59-4c29-9a4b-4a0031c1be60	ishya-uploads	media/file-1778424857339-53040387.jfif	\N	2026-05-30 17:24:37.954119+00	2026-05-30 17:24:37.954119+00	2026-05-30 17:24:37.954119+00	{"eTag": "\\"00948154818d4c05f3cea6bab878bbee\\"", "size": 11162, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:24:38.000Z", "contentLength": 11162, "httpStatusCode": 200}	26469a5b-ec44-4aa0-901b-f73715c389e2	\N	{}
79e934d4-8b20-4a78-ab71-85d432aca4f0	ishya-uploads	media/file-1778681014133-713830233.jpg	\N	2026-05-30 17:25:08.874696+00	2026-05-30 17:25:08.874696+00	2026-05-30 17:25:08.874696+00	{"eTag": "\\"8ab5656d97065948ae38067e1966048a-5\\"", "size": 25177002, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:25:08.000Z", "contentLength": 25177002, "httpStatusCode": 200}	bb02f5a6-1cbb-4473-8a5d-9084f2a13084	\N	{}
7250d982-7d85-46d0-94f9-3a8b7e8b13bf	ishya-uploads	media/file-1778943664121-685831733.webm	\N	2026-05-30 17:25:27.518946+00	2026-05-30 17:25:27.518946+00	2026-05-30 17:25:27.518946+00	{"eTag": "\\"9185060f3ba225f228fd4e82a8c89c5c-6\\"", "size": 26949097, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:25:27.000Z", "contentLength": 26949097, "httpStatusCode": 200}	feed174a-610e-4ab4-ab5f-83a7f60214c8	\N	{}
1a0ad0b3-ddee-412e-8682-2454eeb47aa9	ishya-uploads	media/file-1778943996649-631119746.png	\N	2026-05-30 17:25:28.006495+00	2026-05-30 17:25:28.006495+00	2026-05-30 17:25:28.006495+00	{"eTag": "\\"dc202102b13cc526d2470112584d0efe\\"", "size": 10103, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:25:28.000Z", "contentLength": 10103, "httpStatusCode": 200}	692a8c5f-f6c7-48db-9444-5e455817bffa	\N	{}
e196e1a5-5b75-4237-be52-32894324f881	ishya-uploads	media/file-1778944004719-10351226.webm	\N	2026-05-30 17:25:44.423656+00	2026-05-30 17:25:44.423656+00	2026-05-30 17:25:44.423656+00	{"eTag": "\\"9185060f3ba225f228fd4e82a8c89c5c-6\\"", "size": 26949097, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:25:44.000Z", "contentLength": 26949097, "httpStatusCode": 200}	3a0eeb8b-6942-4ff4-bce9-a81dae3bcf85	\N	{}
f6009337-157d-4d68-89e2-474cdd2c2e12	ishya-uploads	media/file-1778945303224-761691735.webm	\N	2026-05-30 17:25:58.687887+00	2026-05-30 17:25:58.687887+00	2026-05-30 17:25:58.687887+00	{"eTag": "\\"1b18876ada267edffcdb6f9c3129e3f8-4\\"", "size": 20456052, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:25:58.000Z", "contentLength": 20456052, "httpStatusCode": 200}	ac469d26-5a89-4df2-a033-b4b559b4f1cf	\N	{}
64705ccd-b016-4c48-b31f-7231d3897afd	ishya-uploads	media/file-1778945338700-308705516.webm	\N	2026-05-30 17:26:18.732681+00	2026-05-30 17:26:18.732681+00	2026-05-30 17:26:18.732681+00	{"eTag": "\\"5ceef51357712d470a0ce7ea264d0046-7\\"", "size": 34636208, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:26:18.000Z", "contentLength": 34636208, "httpStatusCode": 200}	acfb6ba8-d289-4ba8-8ae6-b234c423cccd	\N	{}
0a8640ce-b2b0-4700-9748-1406aeedef9a	ishya-uploads	media/file-1778945350633-323958.webm	\N	2026-05-30 17:26:21.106582+00	2026-05-30 17:26:21.106582+00	2026-05-30 17:26:21.106582+00	{"eTag": "\\"0b8f23ff70f5a0a5a1977cfac5d3e4f3\\"", "size": 2598556, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:26:22.000Z", "contentLength": 2598556, "httpStatusCode": 200}	916f73cb-4fca-4af8-9ee8-675ea3119f99	\N	{}
a6e9744c-780b-4f60-b170-c45c50a967ce	ishya-uploads	media/file-1778945464148-144961764.webm	\N	2026-05-30 17:26:25.407014+00	2026-05-30 17:26:25.407014+00	2026-05-30 17:26:25.407014+00	{"eTag": "\\"6e734d91a99e761d00cf5de7eea3e79e-2\\"", "size": 5600094, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:26:26.000Z", "contentLength": 5600094, "httpStatusCode": 200}	03a9933e-beba-40c5-9256-dfbd6b3ae6d7	\N	{}
01581429-0d6e-4a4d-bdde-5c0922f3f482	ishya-uploads	media/file-1778945552007-4350925.webm	\N	2026-05-30 17:27:16.804484+00	2026-05-30 17:27:16.804484+00	2026-05-30 17:27:16.804484+00	{"eTag": "\\"6e734d91a99e761d00cf5de7eea3e79e-2\\"", "size": 5600094, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:27:17.000Z", "contentLength": 5600094, "httpStatusCode": 200}	e30187e8-0208-4b15-90c7-3d4e91dccae6	\N	{}
df90d6ca-b995-4866-aaaa-58a2d8842acc	ishya-uploads	media/file-1778945864930-539485986.webm	\N	2026-05-30 17:27:33.86779+00	2026-05-30 17:27:33.86779+00	2026-05-30 17:27:33.86779+00	{"eTag": "\\"6e734d91a99e761d00cf5de7eea3e79e-2\\"", "size": 5600094, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:27:34.000Z", "contentLength": 5600094, "httpStatusCode": 200}	1b7dff74-9c35-48b9-9ed0-178209e6606a	\N	{}
48ebc683-80f2-4167-9db6-6cb5e11fcf55	ishya-uploads	media/file-1778947841070-782116473.webm	\N	2026-05-30 17:28:53.982587+00	2026-05-30 17:28:53.982587+00	2026-05-30 17:28:53.982587+00	{"eTag": "\\"77e8c96d323a28edf78d2e2cd417171f-2\\"", "size": 10083858, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:28:54.000Z", "contentLength": 10083858, "httpStatusCode": 200}	d250e1a6-3bbe-4a08-a047-3565ca0cb1f5	\N	{}
a2181e7a-4826-4da4-93d4-00fb08a22d46	ishya-uploads	media/file-1778947846053-161554768.jfif	\N	2026-05-30 17:28:55.810773+00	2026-05-30 17:28:55.810773+00	2026-05-30 17:28:55.810773+00	{"eTag": "\\"0df5f80436e61972ead1dec7096938f3\\"", "size": 15664, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:28:56.000Z", "contentLength": 15664, "httpStatusCode": 200}	77588a97-c66f-4834-8e76-fb13ef5bfc2b	\N	{}
78bd5efb-0937-4577-a093-13441977dce4	ishya-uploads	media/file-1778947850937-251922325.webm	\N	2026-05-30 17:29:08.289595+00	2026-05-30 17:29:08.289595+00	2026-05-30 17:29:08.289595+00	{"eTag": "\\"432d16644e6e27acb9ae07a2addfc09c-5\\"", "size": 22786185, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:29:08.000Z", "contentLength": 22786185, "httpStatusCode": 200}	cd61c772-b831-4481-8130-61d75932e264	\N	{}
08ff848a-be9e-42fe-8bbe-688acee8ac02	ishya-uploads	media/file-1779109221802-74673290.png	\N	2026-05-30 17:29:10.481819+00	2026-05-30 17:29:10.481819+00	2026-05-30 17:29:10.481819+00	{"eTag": "\\"2c15293a6296388fb6f9f5c848984892\\"", "size": 279044, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:29:11.000Z", "contentLength": 279044, "httpStatusCode": 200}	bfc4610c-0c2f-4ac1-9fd3-d2ce4eeafdb6	\N	{}
75f529ce-0c92-4a7d-b19a-1c85b2d5ba74	ishya-uploads	media/file-1779538215052-641146619.png	\N	2026-05-30 17:29:11.442053+00	2026-05-30 17:29:11.442053+00	2026-05-30 17:29:11.442053+00	{"eTag": "\\"2c15293a6296388fb6f9f5c848984892\\"", "size": 279044, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:29:12.000Z", "contentLength": 279044, "httpStatusCode": 200}	1596b38c-2a07-4388-8475-8bf6d9327900	\N	{}
5ea5b0d8-b495-4c9f-aa88-410a415a5067	ishya-uploads	media/file-1779902858460-658703916.jfif	\N	2026-05-30 17:29:11.949374+00	2026-05-30 17:29:11.949374+00	2026-05-30 17:29:11.949374+00	{"eTag": "\\"a96191f71e9802aa66e3a50223b59d49\\"", "size": 5057, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:29:12.000Z", "contentLength": 5057, "httpStatusCode": 200}	259a5982-93b5-4fd4-b9c9-76a1e96c5f3c	\N	{}
f6b75f8c-75d4-491d-87ce-fb35fbd08d81	ishya-uploads	posters/poster-1778317975163.jpg	\N	2026-05-30 17:29:13.195521+00	2026-05-30 17:29:13.195521+00	2026-05-30 17:29:13.195521+00	{"eTag": "\\"c4961bef2062cec5fadff91b06ca3361\\"", "size": 68681, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:29:14.000Z", "contentLength": 68681, "httpStatusCode": 200}	5bd537f4-59c3-43a0-9203-bd1d8f1447e8	\N	{}
add8b988-4b78-4e76-a538-6ec1cbc027ca	ishya-uploads	posters/poster-1778318101410.jpg	\N	2026-05-30 17:29:14.011393+00	2026-05-30 17:29:14.011393+00	2026-05-30 17:29:14.011393+00	{"eTag": "\\"c4961bef2062cec5fadff91b06ca3361\\"", "size": 68681, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:29:14.000Z", "contentLength": 68681, "httpStatusCode": 200}	26f75d5b-31b6-47c4-bfd2-d8badd3cdd3e	\N	{}
e2f267d3-f3ed-4f3d-a7ea-ce8a013e053e	ishya-uploads	posters/poster-1778318220316.jpg	\N	2026-05-30 17:29:14.801581+00	2026-05-30 17:29:14.801581+00	2026-05-30 17:29:14.801581+00	{"eTag": "\\"c4961bef2062cec5fadff91b06ca3361\\"", "size": 68681, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:29:15.000Z", "contentLength": 68681, "httpStatusCode": 200}	349852fd-5c32-4013-b879-cde488b8b098	\N	{}
c3db8e2d-0bbd-4446-96b3-c3594fb26146	ishya-uploads	posters/poster-1778328010721.jfif	\N	2026-05-30 17:29:15.24326+00	2026-05-30 17:29:15.24326+00	2026-05-30 17:29:15.24326+00	{"eTag": "\\"6623a76102b2d1f192cd09ff0cb445d4\\"", "size": 14113, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:29:16.000Z", "contentLength": 14113, "httpStatusCode": 200}	83b94b7f-0256-454a-ae46-67f1cc0a8ce5	\N	{}
d741892a-18bc-4344-b841-d349692fbc10	ishya-uploads	posters/poster-1778328467867.jfif	\N	2026-05-30 17:29:15.72981+00	2026-05-30 17:29:15.72981+00	2026-05-30 17:29:15.72981+00	{"eTag": "\\"aa2196dd1e9df35f4d607ad4a7d15407\\"", "size": 8534, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:29:16.000Z", "contentLength": 8534, "httpStatusCode": 200}	a92a9dae-784a-4254-8f22-696109e7df26	\N	{}
cdd1d701-31bb-4fcb-b49b-0e7e2e3865a6	ishya-uploads	posters/poster-1778328562343.jpg	\N	2026-05-30 17:29:17.182968+00	2026-05-30 17:29:17.182968+00	2026-05-30 17:29:17.182968+00	{"eTag": "\\"4023904e71b725cb12ade1272313824f\\"", "size": 80491, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:29:18.000Z", "contentLength": 80491, "httpStatusCode": 200}	29dd2043-4719-4354-9669-8c608f60acc0	\N	{}
e26a2507-1db2-4a8b-82f8-6291315e7d7a	ishya-uploads	posters/poster-1779878427116-480481444.jpg	\N	2026-05-30 17:30:22.669062+00	2026-05-30 17:30:22.669062+00	2026-05-30 17:30:22.669062+00	{"eTag": "\\"0d37e05d789a3660f8705e27dc41cb72-5\\"", "size": 25318346, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:30:22.000Z", "contentLength": 25318346, "httpStatusCode": 200}	d3220da7-2e5e-43df-ab0f-b2211aa775ac	\N	{}
8139f8ba-20c7-4bf2-bb3d-34ba16c7173d	ishya-uploads	posters/poster-1779878442615-240014962.jpg	\N	2026-05-30 17:31:17.030317+00	2026-05-30 17:31:17.030317+00	2026-05-30 17:31:17.030317+00	{"eTag": "\\"73f2890b14fb866b5276b4f3b2118183-4\\"", "size": 19824928, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:31:17.000Z", "contentLength": 19824928, "httpStatusCode": 200}	1c03f34d-8237-44fb-ab40-aa61dbed4a2a	\N	{}
f5184db7-254b-49fa-9f6c-256d60f1aae6	ishya-uploads	posters/poster-1780059336612-368479393.jfif	\N	2026-05-30 17:31:18.403891+00	2026-05-30 17:31:18.403891+00	2026-05-30 17:31:18.403891+00	{"eTag": "\\"78ff02bf5cd5165446403d6385b20100\\"", "size": 9125, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:31:19.000Z", "contentLength": 9125, "httpStatusCode": 200}	efe95f6c-c15d-4fde-b288-76935efa7f13	\N	{}
736a6bae-49b5-4588-9885-0765e6a5b6a1	ishya-uploads	scripts/script-1778683531234-887952747.docx	\N	2026-05-30 17:31:19.064629+00	2026-05-30 17:31:19.064629+00	2026-05-30 17:31:19.064629+00	{"eTag": "\\"65762e440a153ecc07c460db25fd4774\\"", "size": 25762, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T17:31:20.000Z", "contentLength": 25762, "httpStatusCode": 200}	53949893-dd5c-49fb-983d-e1e745545e02	\N	{}
e6ea55eb-12c1-48c0-ba62-4ce5e84d77a9	ishya-uploads	posters/poster-1780164560783-682635971.jfif	\N	2026-05-30 18:09:21.732318+00	2026-05-30 18:09:21.732318+00	2026-05-30 18:09:21.732318+00	{"eTag": "\\"78ff02bf5cd5165446403d6385b20100\\"", "size": 9125, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T18:09:22.000Z", "contentLength": 9125, "httpStatusCode": 200}	45369e6c-8de3-4a37-a384-8c557fa0acca	\N	{}
8ccbd6c1-bee0-495a-b399-2f48adfa79bd	ishya-uploads	posters/poster-1780164825719-283225278.jfif	\N	2026-05-30 18:13:46.098463+00	2026-05-30 18:13:46.098463+00	2026-05-30 18:13:46.098463+00	{"eTag": "\\"78ff02bf5cd5165446403d6385b20100\\"", "size": 9125, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T18:13:47.000Z", "contentLength": 9125, "httpStatusCode": 200}	5c664674-42b2-43dc-b87e-35e57ec7e801	\N	{}
a4365865-d6f3-4d09-90b7-885bbb229c1a	ishya-uploads	posters/poster-1780164928042-120191451.jpg	\N	2026-05-30 18:15:30.442112+00	2026-05-30 18:15:30.442112+00	2026-05-30 18:15:30.442112+00	{"eTag": "\\"05ee146977cceaf4b5bc97cea9e9df4a-2\\"", "size": 7472685, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T18:15:31.000Z", "contentLength": 7472685, "httpStatusCode": 200}	48473050-5ab7-4b6a-91f2-bfcd711d7345	\N	{}
d201cbd2-96e0-4e6f-9071-53201eacd6b4	ishya-uploads	scripts/file-1780169173859-494760800.pdf	\N	2026-05-30 19:26:15.478155+00	2026-05-30 19:26:15.478155+00	2026-05-30 19:26:15.478155+00	{"eTag": "\\"36cf8bcfbe6cfde4b217af8ca5d79587\\"", "size": 916143, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-05-30T19:26:16.000Z", "contentLength": 916143, "httpStatusCode": 200}	dd9f8899-c95e-47b3-9c64-4d0f86cd3812	\N	{}
1937851f-12da-4be0-a3ed-e862824bb096	ishya-uploads	posters/poster-1780217893162-661987322.jpg	\N	2026-05-31 08:58:17.604176+00	2026-05-31 08:58:17.604176+00	2026-05-31 08:58:17.604176+00	{"eTag": "\\"0d37e05d789a3660f8705e27dc41cb72-5\\"", "size": 25318346, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-31T08:58:17.000Z", "contentLength": 25318346, "httpStatusCode": 200}	badeab1f-2a62-4135-aa75-18694d32f19b	\N	{}
4125113c-5480-46fe-9e7c-63ec572f4d8e	ishya-uploads	posters/poster-1780217995565-414733663.jpg	\N	2026-05-31 08:59:58.533561+00	2026-05-31 08:59:58.533561+00	2026-05-31 08:59:58.533561+00	{"eTag": "\\"73f2890b14fb866b5276b4f3b2118183-4\\"", "size": 19824928, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-31T08:59:58.000Z", "contentLength": 19824928, "httpStatusCode": 200}	233465f6-03b6-4368-85b4-4107a9499202	\N	{}
c93a415c-5bb8-49b7-a25a-d867bffd2f0d	ishya-uploads	posters/poster-1780218209314-279585543.jfif	\N	2026-05-31 09:03:29.767452+00	2026-05-31 09:03:29.767452+00	2026-05-31 09:03:29.767452+00	{"eTag": "\\"78ff02bf5cd5165446403d6385b20100\\"", "size": 9125, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-31T09:03:30.000Z", "contentLength": 9125, "httpStatusCode": 200}	6fc27bfd-d3b1-4ae4-9644-b2077f11fc6a	\N	{}
b85a23cf-c051-46fc-85ce-9f348ac352ed	ishya-uploads	scripts/file-1780218314733-813302277.pdf	\N	2026-05-31 09:05:16.291152+00	2026-05-31 09:05:16.291152+00	2026-05-31 09:05:16.291152+00	{"eTag": "\\"9b7dd2dfd6e225a12e32adf865e9c63c\\"", "size": 5231556, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-05-31T09:05:17.000Z", "contentLength": 5231556, "httpStatusCode": 200}	1a3596ea-ebc3-4c6c-a803-27efcd4ea2ce	\N	{}
c484e3c9-2e9f-49d5-9d5a-26a6a3750537	ishya-uploads	media/file-1780234945521-576541112.webm	\N	2026-05-31 13:42:29.083839+00	2026-05-31 13:42:29.083839+00	2026-05-31 13:42:29.083839+00	{"eTag": "\\"5d48c7fbe2f6371f4b64c3c2c62786ff-5\\"", "size": 24478417, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-31T13:42:29.000Z", "contentLength": 24478417, "httpStatusCode": 200}	6b4310c0-f2db-4db2-8368-45bb1298423d	\N	{}
4b2b5860-5eb0-41fe-89de-191185267f49	ishya-uploads	media/file-1780234948627-657214307.webm	\N	2026-05-31 13:42:31.095875+00	2026-05-31 13:42:31.095875+00	2026-05-31 13:42:31.095875+00	{"eTag": "\\"17cca343d2c8e287fb1a3a661659caca-3\\"", "size": 13764145, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-31T13:42:31.000Z", "contentLength": 13764145, "httpStatusCode": 200}	40928eaf-ab81-4a78-8915-1eb5902c7ea0	\N	{}
916bf04e-fae4-4499-8f1b-642c11bc374b	ishya-uploads	media/file-1780234980856-111352224.png	\N	2026-05-31 13:43:02.935373+00	2026-05-31 13:43:02.935373+00	2026-05-31 13:43:02.935373+00	{"eTag": "\\"64055dd3da228fb4071043d332a6cc67\\"", "size": 2660655, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-31T13:43:03.000Z", "contentLength": 2660655, "httpStatusCode": 200}	26bcc253-72e9-4826-8a85-d26553354f47	\N	{}
c1f4cb7c-e3fe-400c-8eb0-e1139e921c00	ishya-uploads	media/file-1780235011918-79471544.webm	\N	2026-05-31 13:43:35.140285+00	2026-05-31 13:43:35.140285+00	2026-05-31 13:43:35.140285+00	{"eTag": "\\"a6e7ab55c31dc064b0058f664bc00b77-5\\"", "size": 22767849, "mimetype": "video/webm", "cacheControl": "max-age=3600", "lastModified": "2026-05-31T13:43:35.000Z", "contentLength": 22767849, "httpStatusCode": 200}	5e863971-5f01-46e1-b265-608e858c09b2	\N	{}
cf90a54a-609a-4acb-8369-cfa38260c120	ishya-uploads	media/file-1780235083815-588210776.jpg	\N	2026-05-31 13:44:45.577386+00	2026-05-31 13:44:45.577386+00	2026-05-31 13:44:45.577386+00	{"eTag": "\\"c5ef147309570400d8da28b57597c09e-2\\"", "size": 8244972, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-31T13:44:46.000Z", "contentLength": 8244972, "httpStatusCode": 200}	82c5b260-a0c9-4a4f-bd1c-ef082b3f666b	\N	{}
1d4bb0ac-fdc4-40aa-9804-9a8e363f00fc	ishya-uploads	posters/poster-1780389665031-547866632.jpg	\N	2026-06-02 08:41:07.358104+00	2026-06-02 08:41:07.358104+00	2026-06-02 08:41:07.358104+00	{"eTag": "\\"05ee146977cceaf4b5bc97cea9e9df4a-2\\"", "size": 7472685, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-02T08:41:08.000Z", "contentLength": 7472685, "httpStatusCode": 200}	f94988da-7922-4a30-9405-2ab619327fc8	\N	{}
c08ff79c-454b-4af3-babe-26fb5a40dc6d	ishya-uploads	posters/poster-1780389904269-152704338.jpg	\N	2026-06-02 08:45:06.910691+00	2026-06-02 08:45:06.910691+00	2026-06-02 08:45:06.910691+00	{"eTag": "\\"65fff4156aaca3cb4ddd00e4099be5fb-2\\"", "size": 7514806, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-02T08:45:07.000Z", "contentLength": 7514806, "httpStatusCode": 200}	cbfe1d0a-ef0e-49b2-8c18-8d7368b10fc3	\N	{}
b513eabd-1605-44f3-b793-b40674111dc8	ishya-uploads	posters/poster-1780390080355-652711159.jpg	\N	2026-06-02 08:48:02.298716+00	2026-06-02 08:48:02.298716+00	2026-06-02 08:48:02.298716+00	{"eTag": "\\"d23083e027e39f6f079879aaaaafaa1d-2\\"", "size": 7770216, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-02T08:48:03.000Z", "contentLength": 7770216, "httpStatusCode": 200}	c146f1ce-aee0-488c-b667-6a4a93199f99	\N	{}
d8bb7175-9640-4be6-b959-0384a96da8a7	ishya-uploads	media/file-1780761293091-305040951.png	\N	2026-06-06 15:54:54.511573+00	2026-06-06 15:54:54.511573+00	2026-06-06 15:54:54.511573+00	{"eTag": "\\"5b2c3e3833890e91d2b870f14179ff0a\\"", "size": 141032, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-06T15:54:55.000Z", "contentLength": 141032, "httpStatusCode": 200}	65872552-0243-4f04-82dc-8953af0900dc	\N	{}
50c8b4c7-017c-4b2a-a2b4-50d470942438	ishya-uploads	media/file-1780761317579-98074298.png	\N	2026-06-06 15:55:18.674039+00	2026-06-06 15:55:18.674039+00	2026-06-06 15:55:18.674039+00	{"eTag": "\\"0bc3cc4b8d3ae46659701866b5d7b941\\"", "size": 287722, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-06T15:55:19.000Z", "contentLength": 287722, "httpStatusCode": 200}	42e15dd3-6a98-468a-9d11-6ec48f6c72ca	\N	{}
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: AttendanceRules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."AttendanceRules_id_seq"', 13, true);


--
-- Name: Attendances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Attendances_id_seq"', 18, true);


--
-- Name: BuyerRequests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BuyerRequests_id_seq"', 1, false);


--
-- Name: Buyers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Buyers_id_seq"', 2, true);


--
-- Name: Contracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Contracts_id_seq"', 2, true);


--
-- Name: Events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Events_id_seq"', 6, true);


--
-- Name: Expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Expenses_id_seq"', 1, true);


--
-- Name: MediaFiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."MediaFiles_id_seq"', 15, true);


--
-- Name: MediaInteractions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."MediaInteractions_id_seq"', 6, true);


--
-- Name: Notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Notifications_id_seq"', 21, true);


--
-- Name: PendingUsers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PendingUsers_id_seq"', 13, true);


--
-- Name: ProductionCategories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ProductionCategories_id_seq"', 5, true);


--
-- Name: Productions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Productions_id_seq"', 6, true);


--
-- Name: Revenues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Revenues_id_seq"', 1, false);


--
-- Name: Roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Roles_id_seq"', 8, true);


--
-- Name: Sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Sales_id_seq"', 10, true);


--
-- Name: Scripts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Scripts_id_seq"', 2, true);


--
-- Name: SystemSettings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."SystemSettings_id_seq"', 1, true);


--
-- Name: Talents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Talents_id_seq"', 3, true);


--
-- Name: UserPreferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."UserPreferences_id_seq"', 225, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Users_id_seq"', 12, true);


--
-- Name: WatchProgresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."WatchProgresses_id_seq"', 19, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: AttendanceRules AttendanceRules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_pkey" PRIMARY KEY (id);


--
-- Name: AttendanceRules AttendanceRules_publicToken_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key1" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key10" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key11" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key12" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key13" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key14" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key15" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key16" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key17" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key18" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key19" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key2" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key20" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key21" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key22" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key23" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key24" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key25" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key26" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key27" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key28" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key29" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key3" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key30" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key31" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key32" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key33" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key34" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key35" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key36" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key37" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key38" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key39" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key4" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key40" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key41" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key42" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key43" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key44" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key45" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key46" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key47" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key48" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key49" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key5" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key50" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key51" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key52" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key53" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key54" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key55" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key56" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key57" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key58" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key59" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key6" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key60" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key61" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key62" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key7" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key8" UNIQUE ("publicToken");


--
-- Name: AttendanceRules AttendanceRules_publicToken_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRules"
    ADD CONSTRAINT "AttendanceRules_publicToken_key9" UNIQUE ("publicToken");


--
-- Name: Attendances Attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendances"
    ADD CONSTRAINT "Attendances_pkey" PRIMARY KEY (id);


--
-- Name: BuyerRequests BuyerRequests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BuyerRequests"
    ADD CONSTRAINT "BuyerRequests_pkey" PRIMARY KEY (id);


--
-- Name: Buyers Buyers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Buyers"
    ADD CONSTRAINT "Buyers_pkey" PRIMARY KEY (id);


--
-- Name: Contracts Contracts_contractNumber_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key1" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key10" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key11" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key12" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key13" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key14" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key15" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key16" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key17" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key18" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key19" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key2" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key20" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key21" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key22" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key23" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key24" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key25" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key26" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key27" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key28" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key29" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key3" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key30" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key31" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key32" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key33" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key34" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key35" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key36" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key37" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key38" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key39" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key4" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key40" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key41" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key42" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key43" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key44" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key45" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key46" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key47" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key48" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key49" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key5" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key50" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key51" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key52" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key53" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key54" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key55" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key56" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key57" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key58" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key59" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key6" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key60" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key61" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key62" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key63" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key64" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key65" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key66" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key67" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key68" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key69" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key7" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key70" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key71" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key72" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key73" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key74" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key75" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key76" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key77" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key78" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key79" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key8" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key80" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key81" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key82" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key83" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key84" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key85" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key86" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key87" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key88" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key89" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key9" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key90" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key91" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_contractNumber_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_contractNumber_key92" UNIQUE ("contractNumber");


--
-- Name: Contracts Contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_pkey" PRIMARY KEY (id);


--
-- Name: Events Events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_pkey" PRIMARY KEY (id);


--
-- Name: Expenses Expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Expenses"
    ADD CONSTRAINT "Expenses_pkey" PRIMARY KEY (id);


--
-- Name: MediaFiles MediaFiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MediaFiles"
    ADD CONSTRAINT "MediaFiles_pkey" PRIMARY KEY (id);


--
-- Name: MediaInteractions MediaInteractions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MediaInteractions"
    ADD CONSTRAINT "MediaInteractions_pkey" PRIMARY KEY (id);


--
-- Name: Notifications Notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY (id);


--
-- Name: PendingUsers PendingUsers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key1" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key10" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key11" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key12" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key13" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key14" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key15" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key16" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key17" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key18" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key19" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key2" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key20" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key21" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key22" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key23" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key24" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key25" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key26" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key27" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key28" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key29" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key3" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key30" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key31" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key32" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key33" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key34" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key35" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key36" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key37" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key38" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key39" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key4" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key40" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key41" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key42" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key43" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key44" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key45" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key46" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key47" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key48" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key49" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key5" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key50" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key51" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key52" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key53" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key54" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key55" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key56" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key57" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key58" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key59" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key6" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key60" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key61" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key62" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key63" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key64" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key65" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key66" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key67" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key68" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key69" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key7" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key70" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key71" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key72" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key73" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key74" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key75" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key76" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key77" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key78" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key79" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key8" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key80" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key81" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key82" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key83" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key84" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key85" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key86" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key87" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key88" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key89" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key9" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key90" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key91" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_email_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_email_key92" UNIQUE (email);


--
-- Name: PendingUsers PendingUsers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PendingUsers"
    ADD CONSTRAINT "PendingUsers_pkey" PRIMARY KEY (id);


--
-- Name: ProductionCategories ProductionCategories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key1" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key10" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key11" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key12" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key13" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key14" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key15" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key16" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key17" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key18" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key19" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key2" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key20" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key21" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key22" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key23" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key24" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key25" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key26" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key27" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key28" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key29" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key3" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key30" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key31" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key32" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key33" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key34" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key35" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key36" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key37" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key38" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key39" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key4" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key40" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key41" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key42" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key43" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key44" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key45" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key46" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key47" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key48" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key49" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key5" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key50" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key51" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key52" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key53" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key54" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key55" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key56" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key57" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key58" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key59" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key6" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key60" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key61" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key62" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key63" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key64" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key65" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key66" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key67" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key68" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key69" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key7" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key70" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key71" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key72" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key73" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key74" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key75" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key76" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key77" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key78" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key79" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key8" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key80" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key81" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key82" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key83" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key84" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key85" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key86" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key87" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key88" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key89" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key9" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key90" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key91" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key92" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_name_key93; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_name_key93" UNIQUE (name);


--
-- Name: ProductionCategories ProductionCategories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionCategories"
    ADD CONSTRAINT "ProductionCategories_pkey" PRIMARY KEY (id);


--
-- Name: ProductionTalents ProductionTalents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionTalents"
    ADD CONSTRAINT "ProductionTalents_pkey" PRIMARY KEY ("productionId", "talentId");


--
-- Name: Productions Productions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Productions"
    ADD CONSTRAINT "Productions_pkey" PRIMARY KEY (id);


--
-- Name: Revenues Revenues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Revenues"
    ADD CONSTRAINT "Revenues_pkey" PRIMARY KEY (id);


--
-- Name: Roles Roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key" UNIQUE (name);


--
-- Name: Roles Roles_name_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key1" UNIQUE (name);


--
-- Name: Roles Roles_name_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key10" UNIQUE (name);


--
-- Name: Roles Roles_name_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key11" UNIQUE (name);


--
-- Name: Roles Roles_name_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key12" UNIQUE (name);


--
-- Name: Roles Roles_name_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key13" UNIQUE (name);


--
-- Name: Roles Roles_name_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key14" UNIQUE (name);


--
-- Name: Roles Roles_name_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key15" UNIQUE (name);


--
-- Name: Roles Roles_name_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key16" UNIQUE (name);


--
-- Name: Roles Roles_name_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key17" UNIQUE (name);


--
-- Name: Roles Roles_name_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key18" UNIQUE (name);


--
-- Name: Roles Roles_name_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key19" UNIQUE (name);


--
-- Name: Roles Roles_name_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key2" UNIQUE (name);


--
-- Name: Roles Roles_name_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key20" UNIQUE (name);


--
-- Name: Roles Roles_name_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key21" UNIQUE (name);


--
-- Name: Roles Roles_name_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key22" UNIQUE (name);


--
-- Name: Roles Roles_name_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key23" UNIQUE (name);


--
-- Name: Roles Roles_name_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key24" UNIQUE (name);


--
-- Name: Roles Roles_name_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key25" UNIQUE (name);


--
-- Name: Roles Roles_name_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key26" UNIQUE (name);


--
-- Name: Roles Roles_name_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key27" UNIQUE (name);


--
-- Name: Roles Roles_name_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key28" UNIQUE (name);


--
-- Name: Roles Roles_name_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key29" UNIQUE (name);


--
-- Name: Roles Roles_name_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key3" UNIQUE (name);


--
-- Name: Roles Roles_name_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key30" UNIQUE (name);


--
-- Name: Roles Roles_name_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key31" UNIQUE (name);


--
-- Name: Roles Roles_name_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key32" UNIQUE (name);


--
-- Name: Roles Roles_name_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key33" UNIQUE (name);


--
-- Name: Roles Roles_name_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key34" UNIQUE (name);


--
-- Name: Roles Roles_name_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key35" UNIQUE (name);


--
-- Name: Roles Roles_name_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key36" UNIQUE (name);


--
-- Name: Roles Roles_name_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key37" UNIQUE (name);


--
-- Name: Roles Roles_name_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key38" UNIQUE (name);


--
-- Name: Roles Roles_name_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key39" UNIQUE (name);


--
-- Name: Roles Roles_name_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key4" UNIQUE (name);


--
-- Name: Roles Roles_name_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key40" UNIQUE (name);


--
-- Name: Roles Roles_name_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key41" UNIQUE (name);


--
-- Name: Roles Roles_name_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key42" UNIQUE (name);


--
-- Name: Roles Roles_name_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key43" UNIQUE (name);


--
-- Name: Roles Roles_name_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key44" UNIQUE (name);


--
-- Name: Roles Roles_name_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key45" UNIQUE (name);


--
-- Name: Roles Roles_name_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key46" UNIQUE (name);


--
-- Name: Roles Roles_name_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key47" UNIQUE (name);


--
-- Name: Roles Roles_name_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key48" UNIQUE (name);


--
-- Name: Roles Roles_name_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key49" UNIQUE (name);


--
-- Name: Roles Roles_name_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key5" UNIQUE (name);


--
-- Name: Roles Roles_name_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key50" UNIQUE (name);


--
-- Name: Roles Roles_name_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key51" UNIQUE (name);


--
-- Name: Roles Roles_name_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key52" UNIQUE (name);


--
-- Name: Roles Roles_name_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key53" UNIQUE (name);


--
-- Name: Roles Roles_name_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key54" UNIQUE (name);


--
-- Name: Roles Roles_name_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key55" UNIQUE (name);


--
-- Name: Roles Roles_name_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key56" UNIQUE (name);


--
-- Name: Roles Roles_name_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key57" UNIQUE (name);


--
-- Name: Roles Roles_name_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key58" UNIQUE (name);


--
-- Name: Roles Roles_name_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key59" UNIQUE (name);


--
-- Name: Roles Roles_name_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key6" UNIQUE (name);


--
-- Name: Roles Roles_name_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key60" UNIQUE (name);


--
-- Name: Roles Roles_name_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key61" UNIQUE (name);


--
-- Name: Roles Roles_name_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key62" UNIQUE (name);


--
-- Name: Roles Roles_name_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key63" UNIQUE (name);


--
-- Name: Roles Roles_name_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key64" UNIQUE (name);


--
-- Name: Roles Roles_name_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key65" UNIQUE (name);


--
-- Name: Roles Roles_name_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key66" UNIQUE (name);


--
-- Name: Roles Roles_name_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key67" UNIQUE (name);


--
-- Name: Roles Roles_name_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key68" UNIQUE (name);


--
-- Name: Roles Roles_name_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key69" UNIQUE (name);


--
-- Name: Roles Roles_name_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key7" UNIQUE (name);


--
-- Name: Roles Roles_name_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key70" UNIQUE (name);


--
-- Name: Roles Roles_name_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key71" UNIQUE (name);


--
-- Name: Roles Roles_name_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key72" UNIQUE (name);


--
-- Name: Roles Roles_name_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key73" UNIQUE (name);


--
-- Name: Roles Roles_name_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key74" UNIQUE (name);


--
-- Name: Roles Roles_name_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key75" UNIQUE (name);


--
-- Name: Roles Roles_name_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key76" UNIQUE (name);


--
-- Name: Roles Roles_name_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key77" UNIQUE (name);


--
-- Name: Roles Roles_name_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key78" UNIQUE (name);


--
-- Name: Roles Roles_name_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key79" UNIQUE (name);


--
-- Name: Roles Roles_name_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key8" UNIQUE (name);


--
-- Name: Roles Roles_name_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key80" UNIQUE (name);


--
-- Name: Roles Roles_name_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key81" UNIQUE (name);


--
-- Name: Roles Roles_name_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key82" UNIQUE (name);


--
-- Name: Roles Roles_name_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key83" UNIQUE (name);


--
-- Name: Roles Roles_name_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key84" UNIQUE (name);


--
-- Name: Roles Roles_name_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key85" UNIQUE (name);


--
-- Name: Roles Roles_name_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key86" UNIQUE (name);


--
-- Name: Roles Roles_name_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key87" UNIQUE (name);


--
-- Name: Roles Roles_name_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key88" UNIQUE (name);


--
-- Name: Roles Roles_name_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key89" UNIQUE (name);


--
-- Name: Roles Roles_name_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key9" UNIQUE (name);


--
-- Name: Roles Roles_name_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key90" UNIQUE (name);


--
-- Name: Roles Roles_name_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key91" UNIQUE (name);


--
-- Name: Roles Roles_name_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key92" UNIQUE (name);


--
-- Name: Roles Roles_name_key93; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key93" UNIQUE (name);


--
-- Name: Roles Roles_name_key94; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_name_key94" UNIQUE (name);


--
-- Name: Roles Roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_pkey" PRIMARY KEY (id);


--
-- Name: Sales Sales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_pkey" PRIMARY KEY (id);


--
-- Name: ScriptAssignments ScriptAssignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScriptAssignments"
    ADD CONSTRAINT "ScriptAssignments_pkey" PRIMARY KEY ("scriptId", "talentId");


--
-- Name: Scripts Scripts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Scripts"
    ADD CONSTRAINT "Scripts_pkey" PRIMARY KEY (id);


--
-- Name: SystemSettings SystemSettings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key1" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key10" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key11" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key12" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key13" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key14" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key15" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key16" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key17" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key18" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key19" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key2" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key20" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key21" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key22" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key23" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key24" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key25" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key26" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key27" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key28" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key29" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key3" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key30" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key31" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key32" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key33" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key34" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key35" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key36" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key37" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key38" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key39" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key4" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key40" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key41" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key42" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key43" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key44" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key45" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key46" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key47" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key48" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key49" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key5" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key50" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key51" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key52" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key53" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key54" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key55" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key56" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key57" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key58" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key59" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key6" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key60" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key61" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key62" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key63" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key64" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key65" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key66" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key67" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key68" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key69" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key7" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key70" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key71" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key72" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key73" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key74" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key75" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key76" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key77" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key78" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key79" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key8" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key80" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key81" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key82" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key83" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key84" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key85" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key86" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key87" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key88" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key89" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key9" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key90" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key91" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_key_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_key_key92" UNIQUE (key);


--
-- Name: SystemSettings SystemSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_pkey" PRIMARY KEY (id);


--
-- Name: Talents Talents_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key" UNIQUE (email);


--
-- Name: Talents Talents_email_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key1" UNIQUE (email);


--
-- Name: Talents Talents_email_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key10" UNIQUE (email);


--
-- Name: Talents Talents_email_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key11" UNIQUE (email);


--
-- Name: Talents Talents_email_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key12" UNIQUE (email);


--
-- Name: Talents Talents_email_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key13" UNIQUE (email);


--
-- Name: Talents Talents_email_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key14" UNIQUE (email);


--
-- Name: Talents Talents_email_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key15" UNIQUE (email);


--
-- Name: Talents Talents_email_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key16" UNIQUE (email);


--
-- Name: Talents Talents_email_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key17" UNIQUE (email);


--
-- Name: Talents Talents_email_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key18" UNIQUE (email);


--
-- Name: Talents Talents_email_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key19" UNIQUE (email);


--
-- Name: Talents Talents_email_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key2" UNIQUE (email);


--
-- Name: Talents Talents_email_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key20" UNIQUE (email);


--
-- Name: Talents Talents_email_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key21" UNIQUE (email);


--
-- Name: Talents Talents_email_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key22" UNIQUE (email);


--
-- Name: Talents Talents_email_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key23" UNIQUE (email);


--
-- Name: Talents Talents_email_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key24" UNIQUE (email);


--
-- Name: Talents Talents_email_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key25" UNIQUE (email);


--
-- Name: Talents Talents_email_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key26" UNIQUE (email);


--
-- Name: Talents Talents_email_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key27" UNIQUE (email);


--
-- Name: Talents Talents_email_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key28" UNIQUE (email);


--
-- Name: Talents Talents_email_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key29" UNIQUE (email);


--
-- Name: Talents Talents_email_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key3" UNIQUE (email);


--
-- Name: Talents Talents_email_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key30" UNIQUE (email);


--
-- Name: Talents Talents_email_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key31" UNIQUE (email);


--
-- Name: Talents Talents_email_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key32" UNIQUE (email);


--
-- Name: Talents Talents_email_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key33" UNIQUE (email);


--
-- Name: Talents Talents_email_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key34" UNIQUE (email);


--
-- Name: Talents Talents_email_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key35" UNIQUE (email);


--
-- Name: Talents Talents_email_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key36" UNIQUE (email);


--
-- Name: Talents Talents_email_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key37" UNIQUE (email);


--
-- Name: Talents Talents_email_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key38" UNIQUE (email);


--
-- Name: Talents Talents_email_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key39" UNIQUE (email);


--
-- Name: Talents Talents_email_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key4" UNIQUE (email);


--
-- Name: Talents Talents_email_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key40" UNIQUE (email);


--
-- Name: Talents Talents_email_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key41" UNIQUE (email);


--
-- Name: Talents Talents_email_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key42" UNIQUE (email);


--
-- Name: Talents Talents_email_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key43" UNIQUE (email);


--
-- Name: Talents Talents_email_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key44" UNIQUE (email);


--
-- Name: Talents Talents_email_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key45" UNIQUE (email);


--
-- Name: Talents Talents_email_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key46" UNIQUE (email);


--
-- Name: Talents Talents_email_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key47" UNIQUE (email);


--
-- Name: Talents Talents_email_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key48" UNIQUE (email);


--
-- Name: Talents Talents_email_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key49" UNIQUE (email);


--
-- Name: Talents Talents_email_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key5" UNIQUE (email);


--
-- Name: Talents Talents_email_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key50" UNIQUE (email);


--
-- Name: Talents Talents_email_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key51" UNIQUE (email);


--
-- Name: Talents Talents_email_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key52" UNIQUE (email);


--
-- Name: Talents Talents_email_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key53" UNIQUE (email);


--
-- Name: Talents Talents_email_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key54" UNIQUE (email);


--
-- Name: Talents Talents_email_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key55" UNIQUE (email);


--
-- Name: Talents Talents_email_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key56" UNIQUE (email);


--
-- Name: Talents Talents_email_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key57" UNIQUE (email);


--
-- Name: Talents Talents_email_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key58" UNIQUE (email);


--
-- Name: Talents Talents_email_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key59" UNIQUE (email);


--
-- Name: Talents Talents_email_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key6" UNIQUE (email);


--
-- Name: Talents Talents_email_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key60" UNIQUE (email);


--
-- Name: Talents Talents_email_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key61" UNIQUE (email);


--
-- Name: Talents Talents_email_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key62" UNIQUE (email);


--
-- Name: Talents Talents_email_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key63" UNIQUE (email);


--
-- Name: Talents Talents_email_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key64" UNIQUE (email);


--
-- Name: Talents Talents_email_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key65" UNIQUE (email);


--
-- Name: Talents Talents_email_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key66" UNIQUE (email);


--
-- Name: Talents Talents_email_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key67" UNIQUE (email);


--
-- Name: Talents Talents_email_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key68" UNIQUE (email);


--
-- Name: Talents Talents_email_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key69" UNIQUE (email);


--
-- Name: Talents Talents_email_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key7" UNIQUE (email);


--
-- Name: Talents Talents_email_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key70" UNIQUE (email);


--
-- Name: Talents Talents_email_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key71" UNIQUE (email);


--
-- Name: Talents Talents_email_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key72" UNIQUE (email);


--
-- Name: Talents Talents_email_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key73" UNIQUE (email);


--
-- Name: Talents Talents_email_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key74" UNIQUE (email);


--
-- Name: Talents Talents_email_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key75" UNIQUE (email);


--
-- Name: Talents Talents_email_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key76" UNIQUE (email);


--
-- Name: Talents Talents_email_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key77" UNIQUE (email);


--
-- Name: Talents Talents_email_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key78" UNIQUE (email);


--
-- Name: Talents Talents_email_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key79" UNIQUE (email);


--
-- Name: Talents Talents_email_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key8" UNIQUE (email);


--
-- Name: Talents Talents_email_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key80" UNIQUE (email);


--
-- Name: Talents Talents_email_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key81" UNIQUE (email);


--
-- Name: Talents Talents_email_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key82" UNIQUE (email);


--
-- Name: Talents Talents_email_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key83" UNIQUE (email);


--
-- Name: Talents Talents_email_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key84" UNIQUE (email);


--
-- Name: Talents Talents_email_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key85" UNIQUE (email);


--
-- Name: Talents Talents_email_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key86" UNIQUE (email);


--
-- Name: Talents Talents_email_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key87" UNIQUE (email);


--
-- Name: Talents Talents_email_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key88" UNIQUE (email);


--
-- Name: Talents Talents_email_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key89" UNIQUE (email);


--
-- Name: Talents Talents_email_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key9" UNIQUE (email);


--
-- Name: Talents Talents_email_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key90" UNIQUE (email);


--
-- Name: Talents Talents_email_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key91" UNIQUE (email);


--
-- Name: Talents Talents_email_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_email_key92" UNIQUE (email);


--
-- Name: Talents Talents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_pkey" PRIMARY KEY (id);


--
-- Name: UserPreferences UserPreferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPreferences"
    ADD CONSTRAINT "UserPreferences_pkey" PRIMARY KEY (id);


--
-- Name: UserPreferences UserPreferences_userId_pageKey_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPreferences"
    ADD CONSTRAINT "UserPreferences_userId_pageKey_key" UNIQUE ("userId", "pageKey");


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_email_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key1" UNIQUE (email);


--
-- Name: Users Users_email_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key10" UNIQUE (email);


--
-- Name: Users Users_email_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key11" UNIQUE (email);


--
-- Name: Users Users_email_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key12" UNIQUE (email);


--
-- Name: Users Users_email_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key13" UNIQUE (email);


--
-- Name: Users Users_email_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key14" UNIQUE (email);


--
-- Name: Users Users_email_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key15" UNIQUE (email);


--
-- Name: Users Users_email_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key16" UNIQUE (email);


--
-- Name: Users Users_email_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key17" UNIQUE (email);


--
-- Name: Users Users_email_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key18" UNIQUE (email);


--
-- Name: Users Users_email_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key19" UNIQUE (email);


--
-- Name: Users Users_email_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key2" UNIQUE (email);


--
-- Name: Users Users_email_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key20" UNIQUE (email);


--
-- Name: Users Users_email_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key21" UNIQUE (email);


--
-- Name: Users Users_email_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key22" UNIQUE (email);


--
-- Name: Users Users_email_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key23" UNIQUE (email);


--
-- Name: Users Users_email_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key24" UNIQUE (email);


--
-- Name: Users Users_email_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key25" UNIQUE (email);


--
-- Name: Users Users_email_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key26" UNIQUE (email);


--
-- Name: Users Users_email_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key27" UNIQUE (email);


--
-- Name: Users Users_email_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key28" UNIQUE (email);


--
-- Name: Users Users_email_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key29" UNIQUE (email);


--
-- Name: Users Users_email_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key3" UNIQUE (email);


--
-- Name: Users Users_email_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key30" UNIQUE (email);


--
-- Name: Users Users_email_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key31" UNIQUE (email);


--
-- Name: Users Users_email_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key32" UNIQUE (email);


--
-- Name: Users Users_email_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key33" UNIQUE (email);


--
-- Name: Users Users_email_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key34" UNIQUE (email);


--
-- Name: Users Users_email_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key35" UNIQUE (email);


--
-- Name: Users Users_email_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key36" UNIQUE (email);


--
-- Name: Users Users_email_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key37" UNIQUE (email);


--
-- Name: Users Users_email_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key38" UNIQUE (email);


--
-- Name: Users Users_email_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key39" UNIQUE (email);


--
-- Name: Users Users_email_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key4" UNIQUE (email);


--
-- Name: Users Users_email_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key40" UNIQUE (email);


--
-- Name: Users Users_email_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key41" UNIQUE (email);


--
-- Name: Users Users_email_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key42" UNIQUE (email);


--
-- Name: Users Users_email_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key43" UNIQUE (email);


--
-- Name: Users Users_email_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key44" UNIQUE (email);


--
-- Name: Users Users_email_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key45" UNIQUE (email);


--
-- Name: Users Users_email_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key46" UNIQUE (email);


--
-- Name: Users Users_email_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key47" UNIQUE (email);


--
-- Name: Users Users_email_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key48" UNIQUE (email);


--
-- Name: Users Users_email_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key49" UNIQUE (email);


--
-- Name: Users Users_email_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key5" UNIQUE (email);


--
-- Name: Users Users_email_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key50" UNIQUE (email);


--
-- Name: Users Users_email_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key51" UNIQUE (email);


--
-- Name: Users Users_email_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key52" UNIQUE (email);


--
-- Name: Users Users_email_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key53" UNIQUE (email);


--
-- Name: Users Users_email_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key54" UNIQUE (email);


--
-- Name: Users Users_email_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key55" UNIQUE (email);


--
-- Name: Users Users_email_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key56" UNIQUE (email);


--
-- Name: Users Users_email_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key57" UNIQUE (email);


--
-- Name: Users Users_email_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key58" UNIQUE (email);


--
-- Name: Users Users_email_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key59" UNIQUE (email);


--
-- Name: Users Users_email_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key6" UNIQUE (email);


--
-- Name: Users Users_email_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key60" UNIQUE (email);


--
-- Name: Users Users_email_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key61" UNIQUE (email);


--
-- Name: Users Users_email_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key62" UNIQUE (email);


--
-- Name: Users Users_email_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key63" UNIQUE (email);


--
-- Name: Users Users_email_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key64" UNIQUE (email);


--
-- Name: Users Users_email_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key65" UNIQUE (email);


--
-- Name: Users Users_email_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key66" UNIQUE (email);


--
-- Name: Users Users_email_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key67" UNIQUE (email);


--
-- Name: Users Users_email_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key68" UNIQUE (email);


--
-- Name: Users Users_email_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key69" UNIQUE (email);


--
-- Name: Users Users_email_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key7" UNIQUE (email);


--
-- Name: Users Users_email_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key70" UNIQUE (email);


--
-- Name: Users Users_email_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key71" UNIQUE (email);


--
-- Name: Users Users_email_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key72" UNIQUE (email);


--
-- Name: Users Users_email_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key73" UNIQUE (email);


--
-- Name: Users Users_email_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key74" UNIQUE (email);


--
-- Name: Users Users_email_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key75" UNIQUE (email);


--
-- Name: Users Users_email_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key76" UNIQUE (email);


--
-- Name: Users Users_email_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key77" UNIQUE (email);


--
-- Name: Users Users_email_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key78" UNIQUE (email);


--
-- Name: Users Users_email_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key79" UNIQUE (email);


--
-- Name: Users Users_email_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key8" UNIQUE (email);


--
-- Name: Users Users_email_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key80" UNIQUE (email);


--
-- Name: Users Users_email_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key81" UNIQUE (email);


--
-- Name: Users Users_email_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key82" UNIQUE (email);


--
-- Name: Users Users_email_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key83" UNIQUE (email);


--
-- Name: Users Users_email_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key84" UNIQUE (email);


--
-- Name: Users Users_email_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key85" UNIQUE (email);


--
-- Name: Users Users_email_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key86" UNIQUE (email);


--
-- Name: Users Users_email_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key87" UNIQUE (email);


--
-- Name: Users Users_email_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key88" UNIQUE (email);


--
-- Name: Users Users_email_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key89" UNIQUE (email);


--
-- Name: Users Users_email_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key9" UNIQUE (email);


--
-- Name: Users Users_email_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key90" UNIQUE (email);


--
-- Name: Users Users_email_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key91" UNIQUE (email);


--
-- Name: Users Users_email_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key92" UNIQUE (email);


--
-- Name: Users Users_email_key93; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key93" UNIQUE (email);


--
-- Name: Users Users_email_key94; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key94" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: WatchProgresses WatchProgresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WatchProgresses"
    ADD CONSTRAINT "WatchProgresses_pkey" PRIMARY KEY (id);


--
-- Name: WatchProgresses WatchProgresses_userId_mediaId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WatchProgresses"
    ADD CONSTRAINT "WatchProgresses_userId_mediaId_key" UNIQUE ("userId", "mediaId");


--
-- Name: messages messages_payload_exclusive; Type: CHECK CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages
    ADD CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL))) NOT VALID;


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: idx_users_created_at_desc; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_users_created_at_desc ON auth.users USING btree (created_at DESC);


--
-- Name: idx_users_email; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_users_email ON auth.users USING btree (email);


--
-- Name: idx_users_last_sign_in_at_desc; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_users_last_sign_in_at_desc ON auth.users USING btree (last_sign_in_at DESC);


--
-- Name: idx_users_name; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_users_name ON auth.users USING btree (((raw_user_meta_data ->> 'name'::text))) WHERE ((raw_user_meta_data ->> 'name'::text) IS NOT NULL);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_selec; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_selec ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter, COALESCE(selected_columns, '{}'::text[]));


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: Attendances Attendances_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendances"
    ADD CONSTRAINT "Attendances_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Events"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Attendances Attendances_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendances"
    ADD CONSTRAINT "Attendances_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: Contracts Contracts_buyerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES public."Buyers"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Contracts Contracts_productionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contracts"
    ADD CONSTRAINT "Contracts_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES public."Productions"(id) ON UPDATE CASCADE;


--
-- Name: Events Events_productionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES public."Productions"(id) ON UPDATE CASCADE;


--
-- Name: Expenses Expenses_productionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Expenses"
    ADD CONSTRAINT "Expenses_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES public."Productions"(id) ON UPDATE CASCADE;


--
-- Name: MediaFiles MediaFiles_productionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MediaFiles"
    ADD CONSTRAINT "MediaFiles_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES public."Productions"(id) ON UPDATE CASCADE;


--
-- Name: MediaInteractions MediaInteractions_mediaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MediaInteractions"
    ADD CONSTRAINT "MediaInteractions_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES public."MediaFiles"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MediaInteractions MediaInteractions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MediaInteractions"
    ADD CONSTRAINT "MediaInteractions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: Notifications Notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProductionTalents ProductionTalents_productionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionTalents"
    ADD CONSTRAINT "ProductionTalents_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES public."Productions"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductionTalents ProductionTalents_talentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductionTalents"
    ADD CONSTRAINT "ProductionTalents_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES public."Talents"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Productions Productions_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Productions"
    ADD CONSTRAINT "Productions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."ProductionCategories"(id) ON UPDATE CASCADE;


--
-- Name: Productions Productions_directorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Productions"
    ADD CONSTRAINT "Productions_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: Revenues Revenues_productionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Revenues"
    ADD CONSTRAINT "Revenues_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES public."Productions"(id) ON UPDATE CASCADE;


--
-- Name: Sales Sales_buyerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES public."Buyers"(id) ON UPDATE CASCADE;


--
-- Name: Sales Sales_contractId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES public."Contracts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Sales Sales_productionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES public."Productions"(id) ON UPDATE CASCADE;


--
-- Name: ScriptAssignments ScriptAssignments_scriptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScriptAssignments"
    ADD CONSTRAINT "ScriptAssignments_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES public."Scripts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ScriptAssignments ScriptAssignments_talentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScriptAssignments"
    ADD CONSTRAINT "ScriptAssignments_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES public."Talents"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Scripts Scripts_productionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Scripts"
    ADD CONSTRAINT "Scripts_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES public."Productions"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Talents Talents_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Talents"
    ADD CONSTRAINT "Talents_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserPreferences UserPreferences_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPreferences"
    ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: Users Users_buyerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES public."Buyers"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Users Users_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Roles"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WatchProgresses WatchProgresses_mediaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WatchProgresses"
    ADD CONSTRAINT "WatchProgresses_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES public."MediaFiles"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WatchProgresses WatchProgresses_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WatchProgresses"
    ADD CONSTRAINT "WatchProgresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--

\unrestrict s9hYKBHXXt3rsLFMpKTVJveXdIZP11JjGIv7Y5tD5viifo2vDPYPRTt6XVXea0N

