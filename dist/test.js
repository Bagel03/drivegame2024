"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target2, all) => {
    for (var name in all)
      __defProp(target2, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target2) => (target2 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target2, "default", { value: mod, enumerable: true }) : target2,
    mod
  ));
  var __decorateClass = (decorators, target2, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target2, key) : target2;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target2, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target2, key, result);
    return result;
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };

  // node_modules/.pnpm/sdp@3.2.0/node_modules/sdp/sdp.js
  var require_sdp = __commonJS({
    "node_modules/.pnpm/sdp@3.2.0/node_modules/sdp/sdp.js"(exports, module) {
      "use strict";
      var SDPUtils2 = {};
      SDPUtils2.generateIdentifier = function() {
        return Math.random().toString(36).substring(2, 12);
      };
      SDPUtils2.localCName = SDPUtils2.generateIdentifier();
      SDPUtils2.splitLines = function(blob) {
        return blob.trim().split("\n").map((line) => line.trim());
      };
      SDPUtils2.splitSections = function(blob) {
        const parts = blob.split("\nm=");
        return parts.map((part, index) => (index > 0 ? "m=" + part : part).trim() + "\r\n");
      };
      SDPUtils2.getDescription = function(blob) {
        const sections = SDPUtils2.splitSections(blob);
        return sections && sections[0];
      };
      SDPUtils2.getMediaSections = function(blob) {
        const sections = SDPUtils2.splitSections(blob);
        sections.shift();
        return sections;
      };
      SDPUtils2.matchPrefix = function(blob, prefix) {
        return SDPUtils2.splitLines(blob).filter((line) => line.indexOf(prefix) === 0);
      };
      SDPUtils2.parseCandidate = function(line) {
        let parts;
        if (line.indexOf("a=candidate:") === 0) {
          parts = line.substring(12).split(" ");
        } else {
          parts = line.substring(10).split(" ");
        }
        const candidate = {
          foundation: parts[0],
          component: { 1: "rtp", 2: "rtcp" }[parts[1]] || parts[1],
          protocol: parts[2].toLowerCase(),
          priority: parseInt(parts[3], 10),
          ip: parts[4],
          address: parts[4],
          // address is an alias for ip.
          port: parseInt(parts[5], 10),
          // skip parts[6] == 'typ'
          type: parts[7]
        };
        for (let i = 8; i < parts.length; i += 2) {
          switch (parts[i]) {
            case "raddr":
              candidate.relatedAddress = parts[i + 1];
              break;
            case "rport":
              candidate.relatedPort = parseInt(parts[i + 1], 10);
              break;
            case "tcptype":
              candidate.tcpType = parts[i + 1];
              break;
            case "ufrag":
              candidate.ufrag = parts[i + 1];
              candidate.usernameFragment = parts[i + 1];
              break;
            default:
              if (candidate[parts[i]] === void 0) {
                candidate[parts[i]] = parts[i + 1];
              }
              break;
          }
        }
        return candidate;
      };
      SDPUtils2.writeCandidate = function(candidate) {
        const sdp2 = [];
        sdp2.push(candidate.foundation);
        const component = candidate.component;
        if (component === "rtp") {
          sdp2.push(1);
        } else if (component === "rtcp") {
          sdp2.push(2);
        } else {
          sdp2.push(component);
        }
        sdp2.push(candidate.protocol.toUpperCase());
        sdp2.push(candidate.priority);
        sdp2.push(candidate.address || candidate.ip);
        sdp2.push(candidate.port);
        const type = candidate.type;
        sdp2.push("typ");
        sdp2.push(type);
        if (type !== "host" && candidate.relatedAddress && candidate.relatedPort) {
          sdp2.push("raddr");
          sdp2.push(candidate.relatedAddress);
          sdp2.push("rport");
          sdp2.push(candidate.relatedPort);
        }
        if (candidate.tcpType && candidate.protocol.toLowerCase() === "tcp") {
          sdp2.push("tcptype");
          sdp2.push(candidate.tcpType);
        }
        if (candidate.usernameFragment || candidate.ufrag) {
          sdp2.push("ufrag");
          sdp2.push(candidate.usernameFragment || candidate.ufrag);
        }
        return "candidate:" + sdp2.join(" ");
      };
      SDPUtils2.parseIceOptions = function(line) {
        return line.substring(14).split(" ");
      };
      SDPUtils2.parseRtpMap = function(line) {
        let parts = line.substring(9).split(" ");
        const parsed = {
          payloadType: parseInt(parts.shift(), 10)
          // was: id
        };
        parts = parts[0].split("/");
        parsed.name = parts[0];
        parsed.clockRate = parseInt(parts[1], 10);
        parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
        parsed.numChannels = parsed.channels;
        return parsed;
      };
      SDPUtils2.writeRtpMap = function(codec) {
        let pt = codec.payloadType;
        if (codec.preferredPayloadType !== void 0) {
          pt = codec.preferredPayloadType;
        }
        const channels = codec.channels || codec.numChannels || 1;
        return "a=rtpmap:" + pt + " " + codec.name + "/" + codec.clockRate + (channels !== 1 ? "/" + channels : "") + "\r\n";
      };
      SDPUtils2.parseExtmap = function(line) {
        const parts = line.substring(9).split(" ");
        return {
          id: parseInt(parts[0], 10),
          direction: parts[0].indexOf("/") > 0 ? parts[0].split("/")[1] : "sendrecv",
          uri: parts[1],
          attributes: parts.slice(2).join(" ")
        };
      };
      SDPUtils2.writeExtmap = function(headerExtension) {
        return "a=extmap:" + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== "sendrecv" ? "/" + headerExtension.direction : "") + " " + headerExtension.uri + (headerExtension.attributes ? " " + headerExtension.attributes : "") + "\r\n";
      };
      SDPUtils2.parseFmtp = function(line) {
        const parsed = {};
        let kv;
        const parts = line.substring(line.indexOf(" ") + 1).split(";");
        for (let j2 = 0; j2 < parts.length; j2++) {
          kv = parts[j2].trim().split("=");
          parsed[kv[0].trim()] = kv[1];
        }
        return parsed;
      };
      SDPUtils2.writeFmtp = function(codec) {
        let line = "";
        let pt = codec.payloadType;
        if (codec.preferredPayloadType !== void 0) {
          pt = codec.preferredPayloadType;
        }
        if (codec.parameters && Object.keys(codec.parameters).length) {
          const params = [];
          Object.keys(codec.parameters).forEach((param) => {
            if (codec.parameters[param] !== void 0) {
              params.push(param + "=" + codec.parameters[param]);
            } else {
              params.push(param);
            }
          });
          line += "a=fmtp:" + pt + " " + params.join(";") + "\r\n";
        }
        return line;
      };
      SDPUtils2.parseRtcpFb = function(line) {
        const parts = line.substring(line.indexOf(" ") + 1).split(" ");
        return {
          type: parts.shift(),
          parameter: parts.join(" ")
        };
      };
      SDPUtils2.writeRtcpFb = function(codec) {
        let lines = "";
        let pt = codec.payloadType;
        if (codec.preferredPayloadType !== void 0) {
          pt = codec.preferredPayloadType;
        }
        if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
          codec.rtcpFeedback.forEach((fb) => {
            lines += "a=rtcp-fb:" + pt + " " + fb.type + (fb.parameter && fb.parameter.length ? " " + fb.parameter : "") + "\r\n";
          });
        }
        return lines;
      };
      SDPUtils2.parseSsrcMedia = function(line) {
        const sp = line.indexOf(" ");
        const parts = {
          ssrc: parseInt(line.substring(7, sp), 10)
        };
        const colon = line.indexOf(":", sp);
        if (colon > -1) {
          parts.attribute = line.substring(sp + 1, colon);
          parts.value = line.substring(colon + 1);
        } else {
          parts.attribute = line.substring(sp + 1);
        }
        return parts;
      };
      SDPUtils2.parseSsrcGroup = function(line) {
        const parts = line.substring(13).split(" ");
        return {
          semantics: parts.shift(),
          ssrcs: parts.map((ssrc) => parseInt(ssrc, 10))
        };
      };
      SDPUtils2.getMid = function(mediaSection) {
        const mid = SDPUtils2.matchPrefix(mediaSection, "a=mid:")[0];
        if (mid) {
          return mid.substring(6);
        }
      };
      SDPUtils2.parseFingerprint = function(line) {
        const parts = line.substring(14).split(" ");
        return {
          algorithm: parts[0].toLowerCase(),
          // algorithm is case-sensitive in Edge.
          value: parts[1].toUpperCase()
          // the definition is upper-case in RFC 4572.
        };
      };
      SDPUtils2.getDtlsParameters = function(mediaSection, sessionpart) {
        const lines = SDPUtils2.matchPrefix(
          mediaSection + sessionpart,
          "a=fingerprint:"
        );
        return {
          role: "auto",
          fingerprints: lines.map(SDPUtils2.parseFingerprint)
        };
      };
      SDPUtils2.writeDtlsParameters = function(params, setupType) {
        let sdp2 = "a=setup:" + setupType + "\r\n";
        params.fingerprints.forEach((fp) => {
          sdp2 += "a=fingerprint:" + fp.algorithm + " " + fp.value + "\r\n";
        });
        return sdp2;
      };
      SDPUtils2.parseCryptoLine = function(line) {
        const parts = line.substring(9).split(" ");
        return {
          tag: parseInt(parts[0], 10),
          cryptoSuite: parts[1],
          keyParams: parts[2],
          sessionParams: parts.slice(3)
        };
      };
      SDPUtils2.writeCryptoLine = function(parameters) {
        return "a=crypto:" + parameters.tag + " " + parameters.cryptoSuite + " " + (typeof parameters.keyParams === "object" ? SDPUtils2.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? " " + parameters.sessionParams.join(" ") : "") + "\r\n";
      };
      SDPUtils2.parseCryptoKeyParams = function(keyParams) {
        if (keyParams.indexOf("inline:") !== 0) {
          return null;
        }
        const parts = keyParams.substring(7).split("|");
        return {
          keyMethod: "inline",
          keySalt: parts[0],
          lifeTime: parts[1],
          mkiValue: parts[2] ? parts[2].split(":")[0] : void 0,
          mkiLength: parts[2] ? parts[2].split(":")[1] : void 0
        };
      };
      SDPUtils2.writeCryptoKeyParams = function(keyParams) {
        return keyParams.keyMethod + ":" + keyParams.keySalt + (keyParams.lifeTime ? "|" + keyParams.lifeTime : "") + (keyParams.mkiValue && keyParams.mkiLength ? "|" + keyParams.mkiValue + ":" + keyParams.mkiLength : "");
      };
      SDPUtils2.getCryptoParameters = function(mediaSection, sessionpart) {
        const lines = SDPUtils2.matchPrefix(
          mediaSection + sessionpart,
          "a=crypto:"
        );
        return lines.map(SDPUtils2.parseCryptoLine);
      };
      SDPUtils2.getIceParameters = function(mediaSection, sessionpart) {
        const ufrag = SDPUtils2.matchPrefix(
          mediaSection + sessionpart,
          "a=ice-ufrag:"
        )[0];
        const pwd = SDPUtils2.matchPrefix(
          mediaSection + sessionpart,
          "a=ice-pwd:"
        )[0];
        if (!(ufrag && pwd)) {
          return null;
        }
        return {
          usernameFragment: ufrag.substring(12),
          password: pwd.substring(10)
        };
      };
      SDPUtils2.writeIceParameters = function(params) {
        let sdp2 = "a=ice-ufrag:" + params.usernameFragment + "\r\na=ice-pwd:" + params.password + "\r\n";
        if (params.iceLite) {
          sdp2 += "a=ice-lite\r\n";
        }
        return sdp2;
      };
      SDPUtils2.parseRtpParameters = function(mediaSection) {
        const description = {
          codecs: [],
          headerExtensions: [],
          fecMechanisms: [],
          rtcp: []
        };
        const lines = SDPUtils2.splitLines(mediaSection);
        const mline = lines[0].split(" ");
        description.profile = mline[2];
        for (let i = 3; i < mline.length; i++) {
          const pt = mline[i];
          const rtpmapline = SDPUtils2.matchPrefix(
            mediaSection,
            "a=rtpmap:" + pt + " "
          )[0];
          if (rtpmapline) {
            const codec = SDPUtils2.parseRtpMap(rtpmapline);
            const fmtps = SDPUtils2.matchPrefix(
              mediaSection,
              "a=fmtp:" + pt + " "
            );
            codec.parameters = fmtps.length ? SDPUtils2.parseFmtp(fmtps[0]) : {};
            codec.rtcpFeedback = SDPUtils2.matchPrefix(
              mediaSection,
              "a=rtcp-fb:" + pt + " "
            ).map(SDPUtils2.parseRtcpFb);
            description.codecs.push(codec);
            switch (codec.name.toUpperCase()) {
              case "RED":
              case "ULPFEC":
                description.fecMechanisms.push(codec.name.toUpperCase());
                break;
              default:
                break;
            }
          }
        }
        SDPUtils2.matchPrefix(mediaSection, "a=extmap:").forEach((line) => {
          description.headerExtensions.push(SDPUtils2.parseExtmap(line));
        });
        const wildcardRtcpFb = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-fb:* ").map(SDPUtils2.parseRtcpFb);
        description.codecs.forEach((codec) => {
          wildcardRtcpFb.forEach((fb) => {
            const duplicate = codec.rtcpFeedback.find((existingFeedback) => {
              return existingFeedback.type === fb.type && existingFeedback.parameter === fb.parameter;
            });
            if (!duplicate) {
              codec.rtcpFeedback.push(fb);
            }
          });
        });
        return description;
      };
      SDPUtils2.writeRtpDescription = function(kind, caps) {
        let sdp2 = "";
        sdp2 += "m=" + kind + " ";
        sdp2 += caps.codecs.length > 0 ? "9" : "0";
        sdp2 += " " + (caps.profile || "UDP/TLS/RTP/SAVPF") + " ";
        sdp2 += caps.codecs.map((codec) => {
          if (codec.preferredPayloadType !== void 0) {
            return codec.preferredPayloadType;
          }
          return codec.payloadType;
        }).join(" ") + "\r\n";
        sdp2 += "c=IN IP4 0.0.0.0\r\n";
        sdp2 += "a=rtcp:9 IN IP4 0.0.0.0\r\n";
        caps.codecs.forEach((codec) => {
          sdp2 += SDPUtils2.writeRtpMap(codec);
          sdp2 += SDPUtils2.writeFmtp(codec);
          sdp2 += SDPUtils2.writeRtcpFb(codec);
        });
        let maxptime = 0;
        caps.codecs.forEach((codec) => {
          if (codec.maxptime > maxptime) {
            maxptime = codec.maxptime;
          }
        });
        if (maxptime > 0) {
          sdp2 += "a=maxptime:" + maxptime + "\r\n";
        }
        if (caps.headerExtensions) {
          caps.headerExtensions.forEach((extension) => {
            sdp2 += SDPUtils2.writeExtmap(extension);
          });
        }
        return sdp2;
      };
      SDPUtils2.parseRtpEncodingParameters = function(mediaSection) {
        const encodingParameters = [];
        const description = SDPUtils2.parseRtpParameters(mediaSection);
        const hasRed = description.fecMechanisms.indexOf("RED") !== -1;
        const hasUlpfec = description.fecMechanisms.indexOf("ULPFEC") !== -1;
        const ssrcs = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils2.parseSsrcMedia(line)).filter((parts) => parts.attribute === "cname");
        const primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
        let secondarySsrc;
        const flows = SDPUtils2.matchPrefix(mediaSection, "a=ssrc-group:FID").map((line) => {
          const parts = line.substring(17).split(" ");
          return parts.map((part) => parseInt(part, 10));
        });
        if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
          secondarySsrc = flows[0][1];
        }
        description.codecs.forEach((codec) => {
          if (codec.name.toUpperCase() === "RTX" && codec.parameters.apt) {
            let encParam = {
              ssrc: primarySsrc,
              codecPayloadType: parseInt(codec.parameters.apt, 10)
            };
            if (primarySsrc && secondarySsrc) {
              encParam.rtx = { ssrc: secondarySsrc };
            }
            encodingParameters.push(encParam);
            if (hasRed) {
              encParam = JSON.parse(JSON.stringify(encParam));
              encParam.fec = {
                ssrc: primarySsrc,
                mechanism: hasUlpfec ? "red+ulpfec" : "red"
              };
              encodingParameters.push(encParam);
            }
          }
        });
        if (encodingParameters.length === 0 && primarySsrc) {
          encodingParameters.push({
            ssrc: primarySsrc
          });
        }
        let bandwidth = SDPUtils2.matchPrefix(mediaSection, "b=");
        if (bandwidth.length) {
          if (bandwidth[0].indexOf("b=TIAS:") === 0) {
            bandwidth = parseInt(bandwidth[0].substring(7), 10);
          } else if (bandwidth[0].indexOf("b=AS:") === 0) {
            bandwidth = parseInt(bandwidth[0].substring(5), 10) * 1e3 * 0.95 - 50 * 40 * 8;
          } else {
            bandwidth = void 0;
          }
          encodingParameters.forEach((params) => {
            params.maxBitrate = bandwidth;
          });
        }
        return encodingParameters;
      };
      SDPUtils2.parseRtcpParameters = function(mediaSection) {
        const rtcpParameters = {};
        const remoteSsrc = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils2.parseSsrcMedia(line)).filter((obj) => obj.attribute === "cname")[0];
        if (remoteSsrc) {
          rtcpParameters.cname = remoteSsrc.value;
          rtcpParameters.ssrc = remoteSsrc.ssrc;
        }
        const rsize = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-rsize");
        rtcpParameters.reducedSize = rsize.length > 0;
        rtcpParameters.compound = rsize.length === 0;
        const mux = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-mux");
        rtcpParameters.mux = mux.length > 0;
        return rtcpParameters;
      };
      SDPUtils2.writeRtcpParameters = function(rtcpParameters) {
        let sdp2 = "";
        if (rtcpParameters.reducedSize) {
          sdp2 += "a=rtcp-rsize\r\n";
        }
        if (rtcpParameters.mux) {
          sdp2 += "a=rtcp-mux\r\n";
        }
        if (rtcpParameters.ssrc !== void 0 && rtcpParameters.cname) {
          sdp2 += "a=ssrc:" + rtcpParameters.ssrc + " cname:" + rtcpParameters.cname + "\r\n";
        }
        return sdp2;
      };
      SDPUtils2.parseMsid = function(mediaSection) {
        let parts;
        const spec = SDPUtils2.matchPrefix(mediaSection, "a=msid:");
        if (spec.length === 1) {
          parts = spec[0].substring(7).split(" ");
          return { stream: parts[0], track: parts[1] };
        }
        const planB = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils2.parseSsrcMedia(line)).filter((msidParts) => msidParts.attribute === "msid");
        if (planB.length > 0) {
          parts = planB[0].value.split(" ");
          return { stream: parts[0], track: parts[1] };
        }
      };
      SDPUtils2.parseSctpDescription = function(mediaSection) {
        const mline = SDPUtils2.parseMLine(mediaSection);
        const maxSizeLine = SDPUtils2.matchPrefix(mediaSection, "a=max-message-size:");
        let maxMessageSize;
        if (maxSizeLine.length > 0) {
          maxMessageSize = parseInt(maxSizeLine[0].substring(19), 10);
        }
        if (isNaN(maxMessageSize)) {
          maxMessageSize = 65536;
        }
        const sctpPort = SDPUtils2.matchPrefix(mediaSection, "a=sctp-port:");
        if (sctpPort.length > 0) {
          return {
            port: parseInt(sctpPort[0].substring(12), 10),
            protocol: mline.fmt,
            maxMessageSize
          };
        }
        const sctpMapLines = SDPUtils2.matchPrefix(mediaSection, "a=sctpmap:");
        if (sctpMapLines.length > 0) {
          const parts = sctpMapLines[0].substring(10).split(" ");
          return {
            port: parseInt(parts[0], 10),
            protocol: parts[1],
            maxMessageSize
          };
        }
      };
      SDPUtils2.writeSctpDescription = function(media, sctp) {
        let output = [];
        if (media.protocol !== "DTLS/SCTP") {
          output = [
            "m=" + media.kind + " 9 " + media.protocol + " " + sctp.protocol + "\r\n",
            "c=IN IP4 0.0.0.0\r\n",
            "a=sctp-port:" + sctp.port + "\r\n"
          ];
        } else {
          output = [
            "m=" + media.kind + " 9 " + media.protocol + " " + sctp.port + "\r\n",
            "c=IN IP4 0.0.0.0\r\n",
            "a=sctpmap:" + sctp.port + " " + sctp.protocol + " 65535\r\n"
          ];
        }
        if (sctp.maxMessageSize !== void 0) {
          output.push("a=max-message-size:" + sctp.maxMessageSize + "\r\n");
        }
        return output.join("");
      };
      SDPUtils2.generateSessionId = function() {
        return Math.random().toString().substr(2, 22);
      };
      SDPUtils2.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
        let sessionId;
        const version = sessVer !== void 0 ? sessVer : 2;
        if (sessId) {
          sessionId = sessId;
        } else {
          sessionId = SDPUtils2.generateSessionId();
        }
        const user = sessUser || "thisisadapterortc";
        return "v=0\r\no=" + user + " " + sessionId + " " + version + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n";
      };
      SDPUtils2.getDirection = function(mediaSection, sessionpart) {
        const lines = SDPUtils2.splitLines(mediaSection);
        for (let i = 0; i < lines.length; i++) {
          switch (lines[i]) {
            case "a=sendrecv":
            case "a=sendonly":
            case "a=recvonly":
            case "a=inactive":
              return lines[i].substring(2);
            default:
          }
        }
        if (sessionpart) {
          return SDPUtils2.getDirection(sessionpart);
        }
        return "sendrecv";
      };
      SDPUtils2.getKind = function(mediaSection) {
        const lines = SDPUtils2.splitLines(mediaSection);
        const mline = lines[0].split(" ");
        return mline[0].substring(2);
      };
      SDPUtils2.isRejected = function(mediaSection) {
        return mediaSection.split(" ", 2)[1] === "0";
      };
      SDPUtils2.parseMLine = function(mediaSection) {
        const lines = SDPUtils2.splitLines(mediaSection);
        const parts = lines[0].substring(2).split(" ");
        return {
          kind: parts[0],
          port: parseInt(parts[1], 10),
          protocol: parts[2],
          fmt: parts.slice(3).join(" ")
        };
      };
      SDPUtils2.parseOLine = function(mediaSection) {
        const line = SDPUtils2.matchPrefix(mediaSection, "o=")[0];
        const parts = line.substring(2).split(" ");
        return {
          username: parts[0],
          sessionId: parts[1],
          sessionVersion: parseInt(parts[2], 10),
          netType: parts[3],
          addressType: parts[4],
          address: parts[5]
        };
      };
      SDPUtils2.isValidSDP = function(blob) {
        if (typeof blob !== "string" || blob.length === 0) {
          return false;
        }
        const lines = SDPUtils2.splitLines(blob);
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].length < 2 || lines[i].charAt(1) !== "=") {
            return false;
          }
        }
        return true;
      };
      if (typeof module === "object") {
        module.exports = SDPUtils2;
      }
    }
  });

  // src/engine/polyfills.ts
  Promise.timeout = function(ms) {
    return new Promise((res) => setTimeout(res, ms));
  };
  console.log(Promise.timeout);
  Promise.prototype.timeout = function(ms) {
    return Promise.race([this, Promise.timeout(ms)]);
  };

  // node_modules/.pnpm/file+..+BagelECS+bagelecs-0.0.3.tgz/node_modules/bagelecs/dist/shared.js
  var ve = Object.defineProperty;
  var Re = (r, e, t) => e in r ? ve(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t;
  var d = (r, e, t) => (Re(r, typeof e != "symbol" ? e + "" : e, t), t);
  var Le = typeof importScripts == "function";
  var m = class {
    context;
    color;
    constructor(...e) {
      this.context = typeof e == "string" ? e : e.join(" > "), this.color = `hsl(${JSON.stringify(e).split("").reduce((t, n) => n.charCodeAt(0) + ((t << 5) - t), 0) % 360}, 70%, 60%)`;
    }
    group(...e) {
      console.group(...this.generateContextPrefix("\u2800\u2800", "I", "bgWhite", e));
    }
    groupCollapsed(...e) {
      console.groupCollapsed(...this.generateContextPrefix("\u2800\u2800", "I", "bgWhite", e));
    }
    groupEnd() {
      console.groupEnd();
    }
    log(...e) {
      this.info(...e);
    }
    logOk(...e) {
      console.log(...this.generateContextPrefix("\u2714\uFE0F", "O", "bgGreen", e));
    }
    debug(...e) {
      console.log(...this.generateContextPrefix("\u2800\u2800", "D", "bgGray", e));
    }
    info(...e) {
      console.info(...this.generateContextPrefix("\u2800\u2800", "I", "bgWhite", e));
    }
    warn(...e) {
      console.warn(...this.generateContextPrefix("\u26A0\uFE0F", "W", "bgYellow", e));
    }
    error(...e) {
      console.error(...this.generateContextPrefix("\u274C", "!", "bgRed", e));
    }
    generateContextPrefix(e, t, n, o) {
      let i = this.color, a = "";
      switch (t) {
        case "O":
          i = "lime";
          break;
        case "!":
          i = "red";
          break;
        case "W":
          i = "yellow";
          break;
        case "D":
          i = "#888", a = o.join(" "), o = [];
          break;
        case "I":
          i = this.color;
          break;
      }
      return Le && (e = "\u2699\uFE0F"), [`%c ${e} %c ` + this.context.padEnd(30, " ") + " %c " + a, `background: ${i}; color: #fff; padding: 2px 5px 0 5px;  border-top-left-radius: 3px; border-bottom-left-radius: 3px;`, `background: #333438; color: ${i}; border-top-right-radius: 3px; border-bottom-right-radius: 3px; padding-top: 2px`, "color: gray", ...o];
    }
  };
  var U = new m("Archetype Manager");
  var v = class {
    constructor(e, t, n) {
      this.id = e;
      this.components = t;
      this.entities = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * (n + 1))), this.lastModified = performance.now();
    }
    graph = { added: /* @__PURE__ */ new Map(), removed: /* @__PURE__ */ new Map() };
    entities;
    lastModified;
    addEntity(e) {
      this.entities[++this.entities[0]] = e, this.lastModified = performance.now();
    }
    removeEntity(e) {
      for (let t = 1; t <= this.entities[0]; t++)
        if (this.entities[t] === e) {
          this.entities[t] = this.entities[this.entities[0]--];
          break;
        }
      this.lastModified = performance.now();
    }
    resize(e) {
      let t = new Int32Array(new SharedArrayBuffer((e + 1) * Int32Array.BYTES_PER_ELEMENT));
      t.set(this.entities), this.entities = t;
    }
  };
  var P = class {
    constructor(e) {
      this.world = e;
      this.archetypes.set(0, this.defaultArchetype), this.entityArchetypes = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * e.maxEntities));
    }
    archetypes = /* @__PURE__ */ new Map();
    entityArchetypes;
    nextArchetypeId = 1;
    defaultArchetype = new v(0, /* @__PURE__ */ new Set(), 1);
    loadFromData(e) {
      U.log("Loading from data dump:", e), this.defaultArchetype = Object.create(v.prototype, Object.getOwnPropertyDescriptors(e.defaultArchetype)), e.archetypes.forEach((t, n) => {
        this.archetypes.set(n, Object.create(v.prototype, Object.getOwnPropertyDescriptors(t)));
      }), this.entityArchetypes = e.entityArchetypes;
    }
    createNewArchetype(e) {
      U.log("Creating new archetype for components:", e);
      let t = new v(this.nextArchetypeId++, e, this.world.maxEntities);
      return this.world.queryManager.onNewArchetypeCreated(t), this.world.workerManager.onNewArchetypeCreated(t), this.archetypes.set(t.id, t), t;
    }
    getOrCreateArchetype(e) {
      for (let [t, n] of this.archetypes) {
        if (n.components.size !== e.size)
          continue;
        let o = true;
        for (let i of e)
          if (!n.components.has(i)) {
            o = false;
            break;
          }
        if (o)
          return n;
      }
      return this.createNewArchetype(e);
    }
    moveWithoutGraph(e, t, n) {
      t.removeEntity(e), n.addEntity(e), this.entityArchetypes[e] = n.id;
    }
    addEntity(e) {
      this.entityArchetypes[e] = 0, this.defaultArchetype.addEntity(e);
    }
    entityAddComponent(e, t) {
      if (e.has(t)) {
        U.warn("Entity", e, "tried to add component (ID:", t, ") which it already had");
        return;
      }
      let n = this.archetypes.get(this.entityArchetypes[e]);
      if (n.removeEntity(e), !n.graph.added.has(t)) {
        for (let [i, a] of this.archetypes.entries())
          if (a.components.size == n.components.size + 1 && a.components.has(t) && n.components.every((s) => a.components.has(s))) {
            n.graph.added.set(t, a);
            break;
          }
        if (!n.graph.added.has(t)) {
          let i = this.createNewArchetype(n.components.concat(t));
          n.graph.added.set(t, i);
        }
      }
      let o = n.graph.added.get(t);
      o.addEntity(e), this.entityArchetypes[e] = o.id;
    }
    entityRemoveComponent(e, t) {
      if (!e.has(t)) {
        U.warn("Entity", e, "tried to remove component (ID:", t, ") which it did not have");
        return;
      }
      let n = this.archetypes.get(this.entityArchetypes[e]);
      if (n.removeEntity(e), !n.graph.removed.has(t)) {
        for (let [i, a] of this.archetypes)
          if (a.components.size == n.components.size - 1 && a.components.every((s) => s !== t && n.components.has(s))) {
            n.graph.removed.set(t, a);
            break;
          }
        if (!n.graph.removed.has(t)) {
          let i = this.createNewArchetype(n.components.filter((a) => a !== t));
          n.graph.removed.set(t, i);
        }
      }
      let o = n.graph.removed.get(t);
      o.addEntity(e), this.entityArchetypes[e] = o.id;
    }
    resize(e) {
      for (let [t, n] of this.archetypes)
        n.resize(e);
    }
    update() {
    }
  };
  function V(r, ...e) {
    for (; e.length; ) {
      let t = r(e.pop(), e.push);
      t != null && e.push(...t);
    }
  }
  function ge(r, e) {
    for (; r; ) {
      let t = Object.getOwnPropertyDescriptor(r, e);
      if (t)
        return t.get;
      r = Object.getPrototypeOf(r);
    }
  }
  function Te(r, e) {
    for (; r; ) {
      let t = Object.getOwnPropertyDescriptor(r, e);
      if (t)
        return t.set;
      r = Object.getPrototypeOf(r);
    }
  }
  var be = new m("Component Storage");
  var W = class {
    constructor(e) {
      this.world = e;
    }
    storages = [];
    updateQueue = [];
    storagesByType = /* @__PURE__ */ new Map();
    loadFromData(e) {
      be.log("Loading from data dump:", e), e.forEach((t, n) => {
        this.storages[n] = Object.create(l.get(t.id).prototype, Object.getOwnPropertyDescriptors(t));
      });
    }
    createStorage(e, t) {
      let n = l.get(t), o = new n(e, this.world.maxEntities);
      return o.needsUpdate && this.updateQueue.push(o), this.storagesByType.has(o.kind) ? this.storagesByType.get(o.kind).push(o) : this.storagesByType.set(o.kind, [o]), be.log("Created new data storage for", e, "(Type:", t, ")"), o;
    }
    getOrCreateStorage(e, t) {
      return this.storages[e] ? this.storages[e] : (this.storages[e] = this.createStorage(e, t), this.storages[e]);
    }
    resize(e) {
      for (let t = this.storages.length - 1; t >= 0; t--)
        this.storages[t].resize(e);
    }
    update() {
      for (let e = this.updateQueue.length - 1; e >= 0; e--)
        this.updateQueue[e].update();
    }
    getAllByType(e) {
      return this.storagesByType.get(e) ?? [];
    }
  };
  var y = {};
  function f(r, e) {
    y[r] = e;
  }
  f("any", 0);
  f("f64", 1);
  f("f32", 2);
  f("i8", 3);
  f("i16", 4);
  f("i32", 5);
  f("u8", 6);
  f("u16", 7);
  f("u32", 8);
  f("bool", 9);
  var O = class {
    constructor(e, t) {
      this.id = e;
    }
    internalArray;
    needsUpdate = false;
    link(e, t, n, o = false) {
      if (o) {
        let i = ge(e, t), a = Te(e, t);
        Object.defineProperty(this.internalArray, n, { get: i || (() => e[t]), set: a || ((s) => e[t] = s), enumerable: true, configurable: true });
      }
      Object.defineProperty(e, t, { get: () => this.getEnt(n), set: (i) => this.addOrSetEnt(n, i) });
    }
  };
  var $ = class extends O {
    internalArray = [];
    id = y.any;
    kind = y.any;
    getEnt(e) {
      return this.internalArray[e];
    }
    addOrSetEnt(e, t) {
      this.internalArray[e] = t;
    }
    deleteEnt(e) {
      delete this.internalArray[e];
    }
    resize(e) {
    }
  };
  Object.defineProperty(Object.prototype, "storageKind", { configurable: true, enumerable: false, writable: true, value: y.any });
  function A(r, e) {
    return class Se extends O {
      internalArray;
      id = r;
      kind = r;
      constructor(n, o) {
        super(n, o), this.internalArray = new e(new SharedArrayBuffer(e.BYTES_PER_ELEMENT * o));
        let i = new.target;
        i !== Se && !i.patchedByNCS && (new.target.prototype.inc = function(a, s = 1) {
          this.addOrSetEnt(a, this.getEnt(a) + s);
        }, new.target.prototype.mult = function(a, s) {
          this.addOrSetEnt(a, this.getEnt(a) * s);
        }, new.target.prototype.mod = function(a, s) {
          this.addOrSetEnt(a, this.getEnt(a) % s);
        }, i.patchedByNCS = true);
      }
      resize(n) {
        let o = this.internalArray;
        this.internalArray = new e(new SharedArrayBuffer(e.BYTES_PER_ELEMENT * n)), this.internalArray.set(o);
      }
      getEnt(n) {
        return this.internalArray[n];
      }
      deleteEnt(n) {
      }
      addOrSetEnt(n, o) {
        this.internalArray[n] = o;
      }
      inc(n, o) {
        this.internalArray[n] += o;
      }
      mult(n, o) {
        this.internalArray[n] *= o;
      }
      mod(n, o) {
        this.internalArray[n] %= o;
      }
    };
  }
  var Ne = A(y.f64, Float64Array);
  var ke = A(y.f32, Float32Array);
  var Be = A(y.i8, Int16Array);
  var _e = A(y.i16, Int16Array);
  var De = A(y.i32, Int32Array);
  var Ue = A(y.u8, Uint16Array);
  var Pe = A(y.u16, Uint16Array);
  var We = A(y.u32, Uint32Array);
  Object.defineProperty(Number.prototype, "storageKind", { configurable: true, enumerable: false, writable: true, value: y.f64 });
  var J = class extends O {
    internalArray;
    id = y.bool;
    kind = y.bool;
    constructor(e, t) {
      super(e, t), this.internalArray = new Uint8Array(new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT * t));
    }
    getEnt(e) {
      return !!this.internalArray[e];
    }
    addOrSetEnt(e, t) {
      this.internalArray[e] = +t;
    }
    deleteEnt(e) {
    }
    resize(e) {
      let t = this.internalArray;
      this.internalArray = new Uint8Array(new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT * e)), this.internalArray.set(t);
    }
  };
  Object.defineProperty(Boolean.prototype, "storageKind", { configurable: true, enumerable: false, writable: true, value: y.bool });
  var l = /* @__PURE__ */ new Map();
  l.set(0, $);
  l.set(1, Ne);
  l.set(2, ke);
  l.set(3, Be);
  l.set(4, _e);
  l.set(5, De);
  l.set(6, Ue);
  l.set(7, Pe);
  l.set(8, We);
  l.set(9, J);
  var Ee = new m("Custom Storages");
  var Q = /* @__PURE__ */ new Map();
  var X = { 3: /* @__PURE__ */ new Map(), 4: /* @__PURE__ */ new Map(), 5: /* @__PURE__ */ new Map(), 6: /* @__PURE__ */ new Map() };
  f("logged", 3);
  f("enum", 4);
  f("nullable", 5);
  f("ranged", 6);
  var Ae = { 3: Ke, 4: je, 5: ze, 6: Fe };
  function k(r) {
    let e = JSON.stringify(r);
    if (X[r.type].has(e))
      return X[r.type].get(e);
    let t = l.size;
    X[r.type].set(e, t);
    let n = Ae[r.type](t, r);
    return l.set(t, n), Q.set(t, r), t;
  }
  function Ke(r, { backingStorageId: e, bufferSize: t }) {
    let n = l.get(e);
    return class extends n {
      bufferSize = t;
      needsUpdate = true;
      id = r;
      kind = y.logged;
      log = new Array(t);
      writeableLog = this.log;
      addOrSetEnt(i, a) {
        this.log[0] || (this.writeableLog[0] = /* @__PURE__ */ new Map());
        let s = this.writeableLog[0];
        s.has(i) || s.set(i, super.getEnt(i)), super.addOrSetEnt(i, a);
      }
      update() {
        this.writeableLog.unshift(null) > this.bufferSize && this.writeableLog.pop();
      }
      rollback(i) {
        i > this.bufferSize && (Ee.log("Can not rollback", i, "frames, max buffer size is", this.bufferSize, "frames"), i = this.bufferSize);
        for (let a = 0; a < i + 1; a++)
          this.log[a] && this.log[a].forEach((s, T) => {
            super.addOrSetEnt(T, s);
          });
        this.writeableLog.splice(0, i + 1);
      }
    };
  }
  function je(r, { options: e }) {
    class t extends O {
      internalArray;
      internalMap;
      id = r;
      kind = y.enum;
      options = e;
      constructor(o, i) {
        super(o, i), this.internalArray = new Uint8Array(new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT * i)), e.length > 20;
      }
      getEnt(o) {
        return e[this.internalArray[o]];
      }
      addOrSetEnt(o, i) {
        this.internalArray[o] = e.indexOf(i);
      }
      deleteEnt(o) {
      }
      resize(o) {
        let i = this.internalArray;
        this.internalArray = new Uint8Array(new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT * o)), this.internalArray.set(i);
      }
    }
  }
  function ze(r, e) {
    let t = l.get(e.backingStorageId);
    return class extends t {
      nullValues = /* @__PURE__ */ new Set();
      id = r;
      kind = y.nullable;
      addOrSetEnt(o, i) {
        i == null ? this.nullValues.add(o) : super.addOrSetEnt(o, i);
      }
      getEnt(o) {
        return this.nullValues.has(o) ? null : super.getEnt(o);
      }
      resize(o) {
        super.resize(o);
      }
      deleteEnt(o) {
        super.deleteEnt(o);
      }
    };
  }
  function Fe(r, { backingStorageId: e, capacity: t }) {
    let n = l.get(e);
    return class extends n {
      first;
      kind = y.ranged;
      constructor() {
        super(r, t);
      }
      addOrSetEnt(i, a) {
        return this.first === void 0 && (this.first = i), super.addOrSetEnt(i - this.first, a);
      }
      getEnt(i) {
        return super.getEnt(i - this.first);
      }
      deleteEnt(i) {
        return super.deleteEnt(i - this.first);
      }
      resize(i) {
      }
    };
  }
  function g(r) {
    return typeof r == "number" ? r : r.getId();
  }
  var M = class {
    constructor(e) {
      this.id = e;
    }
    toTypeId() {
      return this.id;
    }
    nullable() {
      return new M(k({ type: y.nullable, backingStorageId: this.id }));
    }
    logged(e = M.defaultLoggedBufferSize) {
      return new M(k({ type: y.logged, backingStorageId: this.id, bufferSize: e }));
    }
    ranged(e) {
      return new M(k({ type: y.ranged, capacity: e, backingStorageId: this.id }));
    }
    vec(e) {
      return new h(new Array(e).fill(0).map((t) => new M(this.id)));
    }
  };
  var u = M;
  d(u, "defaultLoggedBufferSize", 15);
  var h = class {
    #e;
    constructor(e) {
      if (this.#e = e, !(typeof this.#e == "number" || this.#e instanceof h || this.#e instanceof u))
        for (let [t, n] of Object.entries(e))
          this[t] = n;
    }
    toTypeTree() {
      return this.#e;
    }
    static nullableRaw(e) {
      if (e instanceof u)
        return e.nullable();
      if (Array.isArray(e))
        return e.map((n) => this.nullableRaw(n));
      let t = {};
      for (let [n, o] of Object.entries(e))
        t[n] = this.nullableRaw(o);
      return t;
    }
    nullable() {
      return new h(h.nullableRaw(this.#e));
    }
    static loggedRaw(e) {
      if (e instanceof u)
        return e.logged();
      if (Array.isArray(e))
        return e.map((n) => this.loggedRaw(n));
      let t = {};
      for (let [n, o] of Object.entries(e))
        t[n] = this.loggedRaw(o);
      return t;
    }
    logged() {
      return new h(h.loggedRaw(this.#e));
    }
    static rangedRaw(e, t) {
      if (e instanceof u)
        return e.ranged(t);
      if (Array.isArray(e))
        return e.map((o) => this.rangedRaw(o, t));
      let n = {};
      for (let [o, i] of Object.entries(e))
        n[o] = this.rangedRaw(i, t);
      return n;
    }
    ranged(e) {
      return new h(h.rangedRaw(this.#e, e));
    }
  };
  function B(r) {
    return new h(r);
  }
  var Z = class {
  };
  var p = Z;
  d(p, "any", new u(g(y.any))), d(p, "bool", new u(g(y.bool))), d(p, "string", new u(g(y.any))), d(p, "entity", new u(g(y.i32))), d(p, "f64", new u(g(y.f64))), d(p, "f32", new u(g(y.f32))), d(p, "i8", new u(g(y.i8))), d(p, "i16", new u(g(y.i16))), d(p, "i32", new u(g(y.i32))), d(p, "u8", new u(g(y.u8))), d(p, "u16", new u(g(y.u16))), d(p, "u32", new u(g(y.u32))), d(p, "number", Z.f64);
  var I = class {
  };
  d(I, "custom", function(e) {
    return new u(g(0));
  }), d(I, "component", function(e) {
    return new h(e.schema);
  }), d(I, "enum", function(...e) {
    return new u(k({ type: y.enum, options: e }));
  });
  var K = class {
  };
  var E = K;
  d(E, "vec2", B({ x: p.number, y: p.number })), d(E, "vec3", B({ x: p.number, y: p.number, z: p.number })), d(E, "rect", B({ ...K.vec2, width: p.number, height: p.number })), d(E, "circle", B({ ...K.vec2, radius: p.number })), d(E, "directionStr", I.enum("UP", "DOWN", "LEFT", "RIGHT")), d(E, "rotationDirection", I.enum("CLOCKWISE", "COUNTERCLOCKWISE"));
  var St = Object.assign(B, p, I, E);
  var Ie = new m("Components");
  var ee = Symbol("CACHED_HASH");
  var te = 1;
  function S() {
    return te++;
  }
  var w = {};
  function Ge(r) {
    switch (r) {
      case "MANUALLY IMPLEMENTED":
        Function.prototype.getId = function() {
          throw Ie.error("Cannot get the ID of object:", this, 'because the "MANUALLY_IMPLEMENTED" method of getId() was chosen '), new Error("Cannot get the ID of object");
        };
        break;
      case "CONSTRUCTOR HASH":
        Function.prototype.getId = function() {
          if (this[ee])
            return this[ee];
          let e = this.toString(), t;
          for (let n = 0; n < e.length; n++)
            t = Math.imul(31, t) + e.charCodeAt(n) | 0;
          return this[ee] = t, t;
        };
        break;
      case "CONSTRUCTOR NAME":
        Function.prototype.getId = function() {
          return w[this.name] ??= S();
        };
    }
  }
  function _t() {
    Ge("CONSTRUCTOR NAME"), String.prototype.getId = function() {
      return w[this] ??= S();
    }, Ie.log("Patched Object prototype, 3rd party external components are now available");
  }
  var b = class {
    constructor(e) {
      this.cache = e;
    }
    static getId() {
      return this.id;
    }
    static __init__(e) {
      this.prototype.schema = e;
    }
  };
  d(b, "id"), d(b, "currentEntity");
  var re = class extends b {
    static __init__(e) {
      super.__init__(e), this.prototype.propIds = [this.getId()], this.prototype.flattenedSchema = [e], Object.defineProperty(this.prototype, "data", { get: () => this.currentEntity.get(this.getId()), set: (t) => this.currentEntity.update(this.getId(), t) });
    }
    copyIntoStorage(e, t) {
      e.storageManager.getOrCreateStorage(this.constructor.getId(), this.schema).addOrSetEnt(t, this.cache);
    }
  };
  var ne = class extends b {
    constructor(e) {
      super([]);
      for (let t = this.propNames.length - 1; t > -1; t--)
        this.cache[t] = e[this.propNames[t]];
    }
    copyIntoStorage(e, t) {
      for (let n = this.flattenedSchema.length - 1; n > -1; n--)
        e.storageManager.getOrCreateStorage(this.propIds[n], this.flattenedSchema[n]).addOrSetEnt(t, this.cache[n]);
    }
    static __init__(e) {
      this.prototype.flattenedSchema = [], this.prototype.propIds = [], this.prototype.propNames = [];
      for (let [t, n] of Object.entries(e)) {
        let o = S();
        this.prototype.flattenedSchema.push(n), this.prototype.propIds.push(o), this.prototype.propNames.push(t), this[t] = o, Object.defineProperty(this.prototype, t, { get: () => this.currentEntity.get(o), set: (i) => this.currentEntity.update(o, i) });
      }
      super.__init__(e);
    }
  };
  var oe = class extends b {
    constructor(e) {
      super([]);
      let t = [[this.schema, e]];
      V(([n, o], i) => {
        if (typeof n == "number") {
          this.cache.push(o);
          return;
        }
        for (let a of Object.keys(n))
          i([n[a], o[a]]);
      }, t);
    }
    copyIntoStorage(e, t) {
      for (let n = this.flattenedSchema.length - 1; n > -1; n--)
        e.storageManager.getOrCreateStorage(this.propIds[n], this.flattenedSchema[n]).addOrSetEnt(t, this.cache[n]);
    }
    static __init__(e) {
      this.prototype.propIds = [], this.prototype.flattenedSchema = [], V(([n, o, i], a) => {
        if (typeof n == "number") {
          let s = S();
          Object.defineProperty(o, i, { get: () => this.currentEntity.get(s), set: (T) => this.currentEntity.update(s, T) }), this.prototype.propIds.push(s), this.prototype.flattenedSchema.push(n);
          return;
        }
        for (let s of Object.keys(n))
          a([n[s], o[s] = {}, s]);
      }, ...[[e, this, "prototype"]]), super.__init__(e);
    }
  };
  function Ye(r) {
    let e = ie(r);
    if (typeof e == "number") {
      class n extends re {
        static id = S();
      }
      return n.__init__(e), n;
    }
    if (Ve(e)) {
      class n extends ne {
        static id = S();
      }
      return n.__init__(e), n;
    }
    class t extends oe {
      static id = S();
    }
    return t.__init__(e), t;
  }
  function He(r) {
    return typeof r == "number";
  }
  function qe(r) {
    return r instanceof u;
  }
  function Ve(r) {
    return Object.values(r).every((e) => typeof e == "number");
  }
  function $e(r) {
    return r instanceof h;
  }
  function ie(r) {
    if (He(r))
      return r;
    if (qe(r))
      return r.toTypeId();
    if ($e(r))
      return ie(r.toTypeTree());
    let e = {};
    for (let [t, n] of Object.entries(r))
      e[t] = ie(n);
    return e;
  }
  function Wt() {
    Set.prototype.clone = function() {
      return new Set(this);
    }, Set.prototype.concat = function(...r) {
      let e = this.clone();
      for (let t of r)
        t instanceof Set ? t.forEach((n) => e.add(n)) : e.add(t);
      return e;
    }, Set.prototype.every = function(r) {
      for (let e of this)
        if (!r(e))
          return false;
      return true;
    }, Set.prototype.filter = function(r) {
      let e = /* @__PURE__ */ new Set();
      for (let t of this)
        r(t) && e.add(t);
      return e;
    }, Set.prototype.some = function(r) {
      for (let e of this)
        if (r(e))
          return true;
      return false;
    }, Set.prototype.map = function(r) {
      let e = /* @__PURE__ */ new Set();
      for (let t of this)
        e.add(r(t));
      return e;
    };
  }
  var j = (r) => typeof r == "function" && r.toString().startsWith("class");
  var x = class {
    constructor(e) {
      this.componentTester = e;
      typeof e.narrower == "function" && (this[Symbol.iterator] = this.iterator_narrower, this.forEach = this.forEach_narrower), this.entityNarrower = e.narrower;
    }
    targetedArchetypes = [];
    offset = 0;
    stepSize = 1;
    lastCheckedArchetypes = /* @__PURE__ */ new Map();
    setStepSizeAndOffset(e, t) {
      this.stepSize = e, this.offset = t;
    }
    entityNarrower;
    ignoreMultithreadingFragmentation() {
      this.offset = 0, this.stepSize = 1;
    }
    addTargetedArchetype(e) {
      this.targetedArchetypes.push(e), this.lastCheckedArchetypes.set(e, -1 / 0);
    }
    *[Symbol.iterator]() {
      for (let e = this.targetedArchetypes.length - 1; e >= 0; e--)
        for (let t = this.targetedArchetypes[e].entities[0] - this.offset; t > 0; t -= this.stepSize)
          yield this.targetedArchetypes[e].entities[t];
    }
    forEach(e) {
      for (let t = this.targetedArchetypes.length - 1; t >= 0; t--)
        for (let n = this.targetedArchetypes[t].entities[0] - this.offset; n > 0; n -= this.stepSize)
          e(this.targetedArchetypes[t].entities[n]);
    }
    forEach_narrower(e) {
      for (let t = this.targetedArchetypes.length - 1; t >= 0; t--)
        for (let n = this.targetedArchetypes[t].entities[0] - this.offset; n > 0; n -= this.stepSize) {
          let o = this.targetedArchetypes[t].entities[n];
          this.entityNarrower(o) && e(o);
        }
    }
    *iterator_narrower() {
      for (let e = this.targetedArchetypes.length - 1; e >= 0; e--)
        for (let t = this.targetedArchetypes[e].entities[0] - this.offset; t > 0; t -= this.stepSize) {
          let n = this.targetedArchetypes[e].entities[t];
          this.entityNarrower(n) && (yield n);
        }
    }
    addedState = /* @__PURE__ */ new Set();
    removedState = /* @__PURE__ */ new Set();
    NO_OP = new Function();
    forEach_state(e, t, n) {
      let o = new Set(e);
      for (let i = this.targetedArchetypes.length - 1; i >= 0; i--) {
        let a = this.targetedArchetypes[i];
        if (a.lastModified === this.lastCheckedArchetypes.get(a))
          for (let s = this.targetedArchetypes[i].entities[0] - this.offset; s > 0; s -= this.stepSize)
            o.delete(this.targetedArchetypes[i].entities[s]);
        else
          for (let s = this.targetedArchetypes[i].entities[0] - this.offset; s > 0; s -= this.stepSize) {
            let T = this.targetedArchetypes[i].entities[s];
            e.has(T) || (e.add(T), t(T)), o.delete(T);
          }
      }
      o.forEach((i) => {
        n(i), e.delete(i);
      });
    }
    forEachAdded(e) {
      this.forEach_state(this.addedState, e, this.NO_OP);
    }
    forEachRemoved(e) {
      this.forEach_state(this.removedState, this.NO_OP, e);
    }
  };
  var z = class {
    constructor(e) {
      this.world = e;
    }
    queries = [];
    query(...e) {
      let t = new x(ae(...e));
      for (let [n, o] of this.world.archetypeManager.archetypes)
        t.componentTester(o.components) && t.addTargetedArchetype(o);
      return t;
    }
    addQuery(e) {
      this.queries.push(e);
      for (let [t, n] of this.world.archetypeManager.archetypes)
        e.componentTester(n.components) && e.addTargetedArchetype(n);
    }
    onNewArchetypeCreated(e) {
      for (let t = 0; t < this.queries.length; t++)
        this.queries[t].componentTester(e.components) && this.queries[t].addTargetedArchetype(e);
    }
  };
  var _ = (...r) => r.length === 1 && typeof r[0] == "function" && !j(r[0]) ? r[0] : (r = r.map((e) => typeof e == "number" ? e : e.getId()), (e) => r.every((t) => e.has(t)));
  var ae = (...r) => {
    let e = function(o) {
      for (let i = r.length - 1; i > -1; i--)
        if (!r[i](o))
          return false;
      return true;
    }, t = r.map((n) => n.narrower).filter((n) => typeof n == "function");
    return t.length > 0 && (e.narrower = function(n) {
      for (let o = t.length - 1; o > -1; o--)
        if (!t[o](n))
          return false;
      return true;
    }), e;
  };
  var C = class {
    constructor(e) {
      this.world = e;
    }
    init() {
    }
    setStepSizeAndOffset(e, t, n = this.entities) {
      if (n instanceof x)
        n.setStepSizeAndOffset(e, t);
      else
        for (let o of Object.values(n))
          this.setStepSizeAndOffset(e, t, o);
    }
    update() {
    }
  };
  d(C, "nextSystemId", 0), d(C, "runOrder", "STANDARD");
  function $t(r) {
    let e = se(r);
    class t extends C {
      entities = e;
      static id = C.nextSystemId++;
    }
    return t;
  }
  function Je(r) {
    return r.constructor !== Object;
  }
  function we(r) {
    return typeof r == "number" ? _(r) : typeof r == "function" && !j(r) ? r : Array.isArray(r) ? ae(...r.map(we)) : _(r.getId());
  }
  function se(r) {
    if (Je(r))
      return new x(we(r));
    if (Array.isArray(r))
      return r.map(se);
    let e = {};
    for (let [t, n] of Object.entries(r))
      e[t] = se(n);
    return e;
  }
  var F = { LOCAL: 0, REMOTE: 1 };
  var G = class {
    constructor(e) {
      this.world = e;
      this.createSchedule("DEFAULT");
    }
    localSystems = [];
    systemLocations = new Uint8Array(100);
    schedules = {};
    enabledSchedules = {};
    reorderEnabled(e) {
      let t = this.enabledSchedules[e].slice(), n = this.enabledSchedules[e];
      n.length = 0;
      let { first: o, standard: i, last: a } = this.schedules[e];
      n.push(...[...o, ...i, ...a].filter((s) => t.includes(s)));
    }
    registerSystem(e, t = F.REMOTE) {
      this.systemLocations[e] = t;
    }
    createSchedule(e, ...t) {
      this.schedules[e] = { first: [], standard: t, last: [] }, this.enabledSchedules[e] = [];
    }
    addToSchedule(e, t, n, o) {
      let i = this.schedules[t] ??= { first: [], standard: [], last: [] }, { first: a, standard: s, last: T } = i;
      if (n === "STANDARD" || n === "LAST" || n === "FIRST")
        i[n.toLowerCase()].push(e);
      else if ("position" in n)
        n.position < a.length ? a.splice(n.position, 0, e) : n.position < a.length + s.length ? s.splice(n.position - a.length, 0, e) : T.splice(n.position - a.length - s.length, e);
      else {
        let me = Object.keys(n)[0], fe = n[me], he = [a, s, T].find((Me) => Me.includes(fe)), Oe = he.indexOf(fe);
        he.splice(Oe + (me === "before" ? 0 : 1), 0, e);
      }
      o && this.enable(e, t);
    }
    enable(e, t) {
      this.enabledSchedules[t].includes(e) || (this.enabledSchedules[t].push(e), this.reorderEnabled(t));
    }
    disable(e, t) {
      this.enabledSchedules[t].splice(this.enabledSchedules[t].indexOf(e), 1);
    }
    addSystem(e) {
      let { id: t } = e.constructor;
      this.localSystems[t] = e, this.registerSystem(t, F.LOCAL);
      let n = (o) => {
        if (o instanceof x) {
          this.world.queryManager.addQuery(o);
          return;
        }
        for (let i of Object.values(o))
          n(i);
      };
      n(e.entities);
    }
    addRemoteSystem(e) {
      this.registerSystem(e, F.REMOTE);
    }
    update(e = "DEFAULT") {
      let t;
      typeof e == "string" ? t = this.enabledSchedules[e] : t = e;
      let n = [];
      for (let o of t)
        this.systemLocations[o] == F.REMOTE ? n.push(this.world.workerManager.update(o)) : this.localSystems[o].update();
      return Promise.all(n);
    }
  };
  function ye(r, e) {
    return new Promise((t, n) => {
      function o({ data: i }) {
        i.type === e && (r.removeEventListener("message", o), t(i));
      }
      r.addEventListener("message", o);
    });
  }
  var Xe = ((o) => (o[o.init = 0] = "init", o[o.update = 1] = "update", o[o.sync = 2] = "sync", o[o.newArchetype = 3] = "newArchetype", o))(Xe || {});
  var de = new m("Worker Manager");
  var pe = class {
    constructor(e, t) {
      this.url = e;
      this.numThreads = t;
    }
    workers = [];
    postMessage(e) {
      for (let t = this.workers.length - 1; t >= 0; t--)
        this.workers[t].postMessage(e);
    }
    async initAndEmitData(e, t, n) {
      let o = [];
      for (let i = 0; i < this.numThreads; i++)
        this.workers.push(new Worker(this.url, { type: "module" })), n ? this.workers[i].postMessage({ ...e, [n]: i }) : this.workers[i].postMessage(e), o[i] = await ye(this.workers[i], t);
      return o;
    }
  };
  var Y = class {
    constructor(e) {
      this.world = e;
    }
    workers = [];
    triggerArrays = [];
    async loadWorkerSystem(e, t = 1) {
      let n, o, i = new Int32Array(new SharedArrayBuffer(t * Int32Array.BYTES_PER_ELEMENT));
      return t === 1 ? (de.log("Loading remote system..."), n = new Worker(e, { type: "module" }), n.postMessage({ type: 0, storage: this.world.storageManager.storages, components: w, archetypeManager: this.world.archetypeManager, customStorages: Q, stepSize: 1, offset: 0, triggerArray: i }), o = await ye(n, 0)) : (de.log(`Loading remote system with ${t} threads`), n = new pe(e, t), o = (await n.initAndEmitData({ type: 0, storage: this.world.storageManager.storages, components: w, archetypeManager: this.world.archetypeManager, customStorages: Q, stepSize: t, triggerArray: i }, 0, "offset"))[0]), this.workers[o.id] = n, this.triggerArrays[o.id] = i, de.logOk(`Remote system ${o.name} (${o.id}) is ready`), o.id;
    }
    update(e) {
      let t = this.triggerArrays[e];
      if (t.length === 1)
        return Atomics.store(t, 0, 1), Atomics.notify(t, 0), Atomics.waitAsync(t, 0, 1).value;
      let n = [];
      for (let o = t.length - 1; o >= 0; o--)
        Atomics.store(t, o, 1), Atomics.notify(t, o), n.push(Atomics.waitAsync(t, o, 1).value);
      return Promise.all(n);
    }
    updateAll() {
      this.triggerArrays.forEach((e, t) => this.update(t));
    }
    onNewArchetypeCreated(e) {
      for (let t of this.workers)
        t.postMessage({ type: 3, archetype: e });
    }
  };
  function ue(r, e, t) {
    return r >> e & (1 << t) - 1;
  }
  var R = 15;
  function ce(r, e) {
    return typeof r != "number" && (r = r.getId()), r << R | e;
  }
  var xe = (r) => r.push(() => {
    Number.prototype.relate = function(e, t, n) {
      n == null ? this.tag(ce(e, t)) : this.add(ce(e, t), n);
    }, Number.prototype.getAllRelatedBy = function(e) {
      return typeof e != "number" && (e = e.getId()), this.components().filter((t) => t >> R == e).map((t) => ue(t, 0, R));
    }, Number.prototype.getSingleRelatedBy = function(e) {
      typeof e != "number" && (e = e.getId());
      for (let t of this.components())
        if (t >> R == e)
          return ue(t, 0, R);
      return null;
    };
  });
  var N;
  var L;
  var Ce = (r) => r.push(() => {
    N = S(), L = S(), Number.prototype.addChild = function(e) {
      this.relate(N, e), e.relate(L, this);
    }, Number.prototype.children = function() {
      return this.getAllRelatedBy(N);
    };
  });
  var H = new m("World");
  var q = class {
    constructor(e) {
      this.internalMaxEntities = e;
      H.group("Creating world with", e, "entities"), this.storageManager = new W(this), this.queryManager = new z(this), this.workerManager = new Y(this), this.systemManager = new G(this), this.archetypeManager = new P(this), this.entities = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * (e + 1))), q.GLOBAL_WORLD = this, H.groupEnd(), H.logOk("Created world with max capacity of", e, "entities");
    }
    entities;
    storageManager;
    queryManager;
    workerManager;
    systemManager;
    archetypeManager;
    reservedEntity = 0;
    get maxEntities() {
      return this.internalMaxEntities;
    }
    set maxEntities(e) {
      this.internalMaxEntities = e, H.log("Resizing all storages for", e, "entities..."), this.archetypeManager.resize(e), this.storageManager.resize(e);
    }
    openEntIds = [];
    nextEntId = 1;
    spawn(...e) {
      let t = this.openEntIds.pop() ?? this.nextEntId++;
      this.entities[this.entities[0]] = t, this.entities[0]++;
      for (let n of e)
        Array.isArray(n) ? t.add(n[0], n[1]) : t.add(n);
      return t;
    }
    destroy(e) {
      this.openEntIds.push(e), this.archetypeManager.archetypes.get(this.archetypeManager.entityArchetypes[e]).removeEntity(e);
    }
    query(...e) {
      return this.queryManager.query(...e);
    }
    addSystem(e, t = "DEFAULT", n = true, o) {
      e instanceof C || (e = new e(this));
      let i = e.constructor;
      return o ??= i.runOrder, this.systemManager.addSystem(e), e.init(), t === false ? this : (this.systemManager.addToSchedule(i.id, t, o, n), this);
    }
    async addRemoteSystem(e, t) {
      let n = await this.workerManager.loadWorkerSystem(e, t);
      return this.systemManager.addRemoteSystem(n), this;
    }
    createSchedule(e, ...t) {
      return this.systemManager.createSchedule(e, ...t.map((n) => n.id)), this;
    }
    addToSchedule(e, t = "DEFAULT", n, o = true) {
      return this.systemManager.addToSchedule(e.id, t, n ?? e.runOrder, o), this;
    }
    enable(e, t = "DEFAULT") {
      return this.systemManager.enable(e.id, t), this;
    }
    disable(e, t = "DEFAULT") {
      this.systemManager.disable(e.id, t);
    }
    tick(e = "DEFAULT") {
      return this.storageManager.update(), this.archetypeManager.update(), this.update(e);
    }
    update(e = "DEFAULT") {
      if (typeof e == "string")
        return this.systemManager.update(e);
      for (let t = e.length - 1; t >= 0; t--)
        typeof e[t] != "number" && (e[t] = e[t].id);
      return this.systemManager.update(e);
    }
    add(e, t = e.constructor.getId()) {
      if (e instanceof b) {
        e.copyIntoStorage(this, this.reservedEntity);
        return;
      }
      typeof t != "number" && (t = t.getId()), q.GLOBAL_WORLD.storageManager.getOrCreateStorage(t, e.storageKind).addOrSetEnt(this.reservedEntity, e);
    }
    get = this.reservedEntity.get.bind(this.reservedEntity);
    set = this.reservedEntity.set.bind(this.reservedEntity);
    remove(e) {
      typeof e != "number" && (e = e.getId()), this.storageManager.storages[e].deleteEnt(this.reservedEntity);
    }
  };
  var c = q;
  d(c, "GLOBAL_WORLD");
  var Ze = new m("Entities");
  var le = [];
  xe(le);
  Ce(le);
  function Qr() {
    Object.defineProperty(Number.prototype, "world", { configurable: false, enumerable: false, get() {
      return c.GLOBAL_WORLD;
    } }), Number.prototype.add = function(r, e = r.constructor.getId()) {
      if (c.GLOBAL_WORLD.archetypeManager.entityAddComponent(this, e), r instanceof b) {
        r.copyIntoStorage(c.GLOBAL_WORLD, this);
        return;
      }
      typeof e != "number" && (e = e.getId()), c.GLOBAL_WORLD.storageManager.getOrCreateStorage(e, r.storageKind).addOrSetEnt(this, r);
    }, Number.prototype.update = function(r, e) {
      e == null && (e = r), typeof r == "string" ? r = r.getId() : typeof r != "number" && (r = r.constructor.getId()), c.GLOBAL_WORLD.storageManager.getOrCreateStorage(r, 0).addOrSetEnt(this, e);
    }, Number.prototype.set = Number.prototype.update, Number.prototype.get = function(r) {
      return typeof r != "number" && (r = r.getId()), c.GLOBAL_WORLD.storageManager.storages[r].getEnt(this);
    }, Number.prototype.remove = function(r) {
      typeof r != "number" && (r = r.getId()), c.GLOBAL_WORLD.storageManager.storages[r]?.deleteEnt(this), c.GLOBAL_WORLD.archetypeManager.entityRemoveComponent(this, r);
    }, Number.prototype.has = function(r) {
      let { archetypes: e, entityArchetypes: t } = c.GLOBAL_WORLD.archetypeManager;
      return e.get(t[this]).components.has(r);
    }, Number.prototype.components = function() {
      let { archetypes: r, entityArchetypes: e } = c.GLOBAL_WORLD.archetypeManager;
      return r.get(e[this]).components;
    }, Number.prototype.tag = function(r) {
      typeof r != "number" && (r = r.getId()), c.GLOBAL_WORLD.archetypeManager.entityAddComponent(this, r);
    }, Number.prototype.removeTag = function(r) {
      typeof r != "number" && (r = r.getId()), c.GLOBAL_WORLD.archetypeManager.entityRemoveComponent(this, r);
    }, Number.prototype.getSlowRef = function() {
      return new Proxy({}, { get: (r, e, t) => this.get(e), set: (r, e, t, n) => (this.update(e, t), true) });
    }, Number.prototype.getLinkInfo = function(r) {
      return [this, c.GLOBAL_WORLD.storageManager.storages[r].internalArray];
    }, Number.prototype.inc = function(r, e = 1) {
      typeof r != "number" && (r = r.getId()), c.GLOBAL_WORLD.storageManager.storages[r].inc(this, e);
    }, Number.prototype.mult = function(r, e) {
      typeof r != "number" && (r = r.getId()), c.GLOBAL_WORLD.storageManager.storages[r].mult(this, e);
    }, Number.prototype.mod = function(r, e) {
      typeof r != "number" && (r = r.getId()), c.GLOBAL_WORLD.storageManager.storages[r].mod(this, e);
    }, le.forEach((r) => r()), Ze.logOk("Loaded all entity polyfills");
  }

  // node_modules/.pnpm/file+..+BagelECS+bagelecs-0.0.3.tgz/node_modules/bagelecs/dist/bundle.js
  var u2 = new m("World", "Resources");
  Qr();
  _t();
  Wt();

  // node_modules/.pnpm/peerjs-js-binarypack@2.0.0/node_modules/peerjs-js-binarypack/dist/binarypack.mjs
  var $e8379818650e2442$export$93654d4f2d6cd524 = class {
    constructor() {
      this.encoder = new TextEncoder();
      this._pieces = [];
      this._parts = [];
    }
    append_buffer(data) {
      this.flush();
      this._parts.push(data);
    }
    append(data) {
      this._pieces.push(data);
    }
    flush() {
      if (this._pieces.length > 0) {
        const buf = new Uint8Array(this._pieces);
        this._parts.push(buf);
        this._pieces = [];
      }
    }
    toArrayBuffer() {
      const buffer = [];
      for (const part of this._parts)
        buffer.push(part);
      return $e8379818650e2442$var$concatArrayBuffers(buffer).buffer;
    }
  };
  function $e8379818650e2442$var$concatArrayBuffers(bufs) {
    let size = 0;
    for (const buf of bufs)
      size += buf.byteLength;
    const result = new Uint8Array(size);
    let offset = 0;
    for (const buf of bufs) {
      const view = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
      result.set(view, offset);
      offset += buf.byteLength;
    }
    return result;
  }
  function $0cfd7828ad59115f$export$417857010dc9287f(data) {
    const unpacker = new $0cfd7828ad59115f$var$Unpacker(data);
    return unpacker.unpack();
  }
  function $0cfd7828ad59115f$export$2a703dbb0cb35339(data) {
    const packer = new $0cfd7828ad59115f$export$b9ec4b114aa40074();
    packer.pack(data);
    return packer.getBuffer();
  }
  var $0cfd7828ad59115f$var$Unpacker = class {
    constructor(data) {
      this.index = 0;
      this.dataBuffer = data;
      this.dataView = new Uint8Array(this.dataBuffer);
      this.length = this.dataBuffer.byteLength;
    }
    unpack() {
      const type = this.unpack_uint8();
      if (type < 128)
        return type;
      else if ((type ^ 224) < 32)
        return (type ^ 224) - 32;
      let size;
      if ((size = type ^ 160) <= 15)
        return this.unpack_raw(size);
      else if ((size = type ^ 176) <= 15)
        return this.unpack_string(size);
      else if ((size = type ^ 144) <= 15)
        return this.unpack_array(size);
      else if ((size = type ^ 128) <= 15)
        return this.unpack_map(size);
      switch (type) {
        case 192:
          return null;
        case 193:
          return void 0;
        case 194:
          return false;
        case 195:
          return true;
        case 202:
          return this.unpack_float();
        case 203:
          return this.unpack_double();
        case 204:
          return this.unpack_uint8();
        case 205:
          return this.unpack_uint16();
        case 206:
          return this.unpack_uint32();
        case 207:
          return this.unpack_uint64();
        case 208:
          return this.unpack_int8();
        case 209:
          return this.unpack_int16();
        case 210:
          return this.unpack_int32();
        case 211:
          return this.unpack_int64();
        case 212:
          return void 0;
        case 213:
          return void 0;
        case 214:
          return void 0;
        case 215:
          return void 0;
        case 216:
          size = this.unpack_uint16();
          return this.unpack_string(size);
        case 217:
          size = this.unpack_uint32();
          return this.unpack_string(size);
        case 218:
          size = this.unpack_uint16();
          return this.unpack_raw(size);
        case 219:
          size = this.unpack_uint32();
          return this.unpack_raw(size);
        case 220:
          size = this.unpack_uint16();
          return this.unpack_array(size);
        case 221:
          size = this.unpack_uint32();
          return this.unpack_array(size);
        case 222:
          size = this.unpack_uint16();
          return this.unpack_map(size);
        case 223:
          size = this.unpack_uint32();
          return this.unpack_map(size);
      }
    }
    unpack_uint8() {
      const byte = this.dataView[this.index] & 255;
      this.index++;
      return byte;
    }
    unpack_uint16() {
      const bytes = this.read(2);
      const uint16 = (bytes[0] & 255) * 256 + (bytes[1] & 255);
      this.index += 2;
      return uint16;
    }
    unpack_uint32() {
      const bytes = this.read(4);
      const uint32 = ((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3];
      this.index += 4;
      return uint32;
    }
    unpack_uint64() {
      const bytes = this.read(8);
      const uint64 = ((((((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3]) * 256 + bytes[4]) * 256 + bytes[5]) * 256 + bytes[6]) * 256 + bytes[7];
      this.index += 8;
      return uint64;
    }
    unpack_int8() {
      const uint8 = this.unpack_uint8();
      return uint8 < 128 ? uint8 : uint8 - 256;
    }
    unpack_int16() {
      const uint16 = this.unpack_uint16();
      return uint16 < 32768 ? uint16 : uint16 - 65536;
    }
    unpack_int32() {
      const uint32 = this.unpack_uint32();
      return uint32 < 2 ** 31 ? uint32 : uint32 - 2 ** 32;
    }
    unpack_int64() {
      const uint64 = this.unpack_uint64();
      return uint64 < 2 ** 63 ? uint64 : uint64 - 2 ** 64;
    }
    unpack_raw(size) {
      if (this.length < this.index + size)
        throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${size} ${this.length}`);
      const buf = this.dataBuffer.slice(this.index, this.index + size);
      this.index += size;
      return buf;
    }
    unpack_string(size) {
      const bytes = this.read(size);
      let i = 0;
      let str = "";
      let c2;
      let code;
      while (i < size) {
        c2 = bytes[i];
        if (c2 < 160) {
          code = c2;
          i++;
        } else if ((c2 ^ 192) < 32) {
          code = (c2 & 31) << 6 | bytes[i + 1] & 63;
          i += 2;
        } else if ((c2 ^ 224) < 16) {
          code = (c2 & 15) << 12 | (bytes[i + 1] & 63) << 6 | bytes[i + 2] & 63;
          i += 3;
        } else {
          code = (c2 & 7) << 18 | (bytes[i + 1] & 63) << 12 | (bytes[i + 2] & 63) << 6 | bytes[i + 3] & 63;
          i += 4;
        }
        str += String.fromCodePoint(code);
      }
      this.index += size;
      return str;
    }
    unpack_array(size) {
      const objects = new Array(size);
      for (let i = 0; i < size; i++)
        objects[i] = this.unpack();
      return objects;
    }
    unpack_map(size) {
      const map = {};
      for (let i = 0; i < size; i++) {
        const key = this.unpack();
        map[key] = this.unpack();
      }
      return map;
    }
    unpack_float() {
      const uint32 = this.unpack_uint32();
      const sign = uint32 >> 31;
      const exp = (uint32 >> 23 & 255) - 127;
      const fraction = uint32 & 8388607 | 8388608;
      return (sign === 0 ? 1 : -1) * fraction * 2 ** (exp - 23);
    }
    unpack_double() {
      const h32 = this.unpack_uint32();
      const l32 = this.unpack_uint32();
      const sign = h32 >> 31;
      const exp = (h32 >> 20 & 2047) - 1023;
      const hfrac = h32 & 1048575 | 1048576;
      const frac = hfrac * 2 ** (exp - 20) + l32 * 2 ** (exp - 52);
      return (sign === 0 ? 1 : -1) * frac;
    }
    read(length) {
      const j2 = this.index;
      if (j2 + length <= this.length)
        return this.dataView.subarray(j2, j2 + length);
      else
        throw new Error("BinaryPackFailure: read index out of range");
    }
  };
  var $0cfd7828ad59115f$export$b9ec4b114aa40074 = class {
    getBuffer() {
      return this._bufferBuilder.toArrayBuffer();
    }
    pack(value) {
      if (typeof value === "string")
        this.pack_string(value);
      else if (typeof value === "number") {
        if (Math.floor(value) === value)
          this.pack_integer(value);
        else
          this.pack_double(value);
      } else if (typeof value === "boolean") {
        if (value === true)
          this._bufferBuilder.append(195);
        else if (value === false)
          this._bufferBuilder.append(194);
      } else if (value === void 0)
        this._bufferBuilder.append(192);
      else if (typeof value === "object") {
        if (value === null)
          this._bufferBuilder.append(192);
        else {
          const constructor = value.constructor;
          if (value instanceof Array)
            this.pack_array(value);
          else if (value instanceof ArrayBuffer)
            this.pack_bin(new Uint8Array(value));
          else if ("BYTES_PER_ELEMENT" in value) {
            const v2 = value;
            this.pack_bin(new Uint8Array(v2.buffer, v2.byteOffset, v2.byteLength));
          } else if (value instanceof Date)
            this.pack_string(value.toString());
          else if (constructor == Object || constructor.toString().startsWith("class"))
            this.pack_object(value);
          else
            throw new Error(`Type "${constructor.toString()}" not yet supported`);
        }
      } else
        throw new Error(`Type "${typeof value}" not yet supported`);
      this._bufferBuilder.flush();
    }
    pack_bin(blob) {
      const length = blob.length;
      if (length <= 15)
        this.pack_uint8(160 + length);
      else if (length <= 65535) {
        this._bufferBuilder.append(218);
        this.pack_uint16(length);
      } else if (length <= 4294967295) {
        this._bufferBuilder.append(219);
        this.pack_uint32(length);
      } else
        throw new Error("Invalid length");
      this._bufferBuilder.append_buffer(blob);
    }
    pack_string(str) {
      const encoded = this._textEncoder.encode(str);
      const length = encoded.length;
      if (length <= 15)
        this.pack_uint8(176 + length);
      else if (length <= 65535) {
        this._bufferBuilder.append(216);
        this.pack_uint16(length);
      } else if (length <= 4294967295) {
        this._bufferBuilder.append(217);
        this.pack_uint32(length);
      } else
        throw new Error("Invalid length");
      this._bufferBuilder.append_buffer(encoded);
    }
    pack_array(ary) {
      const length = ary.length;
      if (length <= 15)
        this.pack_uint8(144 + length);
      else if (length <= 65535) {
        this._bufferBuilder.append(220);
        this.pack_uint16(length);
      } else if (length <= 4294967295) {
        this._bufferBuilder.append(221);
        this.pack_uint32(length);
      } else
        throw new Error("Invalid length");
      for (let i = 0; i < length; i++)
        this.pack(ary[i]);
    }
    pack_integer(num) {
      if (num >= -32 && num <= 127)
        this._bufferBuilder.append(num & 255);
      else if (num >= 0 && num <= 255) {
        this._bufferBuilder.append(204);
        this.pack_uint8(num);
      } else if (num >= -128 && num <= 127) {
        this._bufferBuilder.append(208);
        this.pack_int8(num);
      } else if (num >= 0 && num <= 65535) {
        this._bufferBuilder.append(205);
        this.pack_uint16(num);
      } else if (num >= -32768 && num <= 32767) {
        this._bufferBuilder.append(209);
        this.pack_int16(num);
      } else if (num >= 0 && num <= 4294967295) {
        this._bufferBuilder.append(206);
        this.pack_uint32(num);
      } else if (num >= -2147483648 && num <= 2147483647) {
        this._bufferBuilder.append(210);
        this.pack_int32(num);
      } else if (num >= -9223372036854776e3 && num <= 9223372036854776e3) {
        this._bufferBuilder.append(211);
        this.pack_int64(num);
      } else if (num >= 0 && num <= 18446744073709552e3) {
        this._bufferBuilder.append(207);
        this.pack_uint64(num);
      } else
        throw new Error("Invalid integer");
    }
    pack_double(num) {
      let sign = 0;
      if (num < 0) {
        sign = 1;
        num = -num;
      }
      const exp = Math.floor(Math.log(num) / Math.LN2);
      const frac0 = num / 2 ** exp - 1;
      const frac1 = Math.floor(frac0 * 2 ** 52);
      const b32 = 2 ** 32;
      const h32 = sign << 31 | exp + 1023 << 20 | frac1 / b32 & 1048575;
      const l32 = frac1 % b32;
      this._bufferBuilder.append(203);
      this.pack_int32(h32);
      this.pack_int32(l32);
    }
    pack_object(obj) {
      const keys = Object.keys(obj);
      const length = keys.length;
      if (length <= 15)
        this.pack_uint8(128 + length);
      else if (length <= 65535) {
        this._bufferBuilder.append(222);
        this.pack_uint16(length);
      } else if (length <= 4294967295) {
        this._bufferBuilder.append(223);
        this.pack_uint32(length);
      } else
        throw new Error("Invalid length");
      for (const prop in obj)
        if (obj.hasOwnProperty(prop)) {
          this.pack(prop);
          this.pack(obj[prop]);
        }
    }
    pack_uint8(num) {
      this._bufferBuilder.append(num);
    }
    pack_uint16(num) {
      this._bufferBuilder.append(num >> 8);
      this._bufferBuilder.append(num & 255);
    }
    pack_uint32(num) {
      const n = num & 4294967295;
      this._bufferBuilder.append((n & 4278190080) >>> 24);
      this._bufferBuilder.append((n & 16711680) >>> 16);
      this._bufferBuilder.append((n & 65280) >>> 8);
      this._bufferBuilder.append(n & 255);
    }
    pack_uint64(num) {
      const high = num / 2 ** 32;
      const low = num % 2 ** 32;
      this._bufferBuilder.append((high & 4278190080) >>> 24);
      this._bufferBuilder.append((high & 16711680) >>> 16);
      this._bufferBuilder.append((high & 65280) >>> 8);
      this._bufferBuilder.append(high & 255);
      this._bufferBuilder.append((low & 4278190080) >>> 24);
      this._bufferBuilder.append((low & 16711680) >>> 16);
      this._bufferBuilder.append((low & 65280) >>> 8);
      this._bufferBuilder.append(low & 255);
    }
    pack_int8(num) {
      this._bufferBuilder.append(num & 255);
    }
    pack_int16(num) {
      this._bufferBuilder.append((num & 65280) >> 8);
      this._bufferBuilder.append(num & 255);
    }
    pack_int32(num) {
      this._bufferBuilder.append(num >>> 24 & 255);
      this._bufferBuilder.append((num & 16711680) >>> 16);
      this._bufferBuilder.append((num & 65280) >>> 8);
      this._bufferBuilder.append(num & 255);
    }
    pack_int64(num) {
      const high = Math.floor(num / 2 ** 32);
      const low = num % 2 ** 32;
      this._bufferBuilder.append((high & 4278190080) >>> 24);
      this._bufferBuilder.append((high & 16711680) >>> 16);
      this._bufferBuilder.append((high & 65280) >>> 8);
      this._bufferBuilder.append(high & 255);
      this._bufferBuilder.append((low & 4278190080) >>> 24);
      this._bufferBuilder.append((low & 16711680) >>> 16);
      this._bufferBuilder.append((low & 65280) >>> 8);
      this._bufferBuilder.append(low & 255);
    }
    constructor() {
      this._bufferBuilder = new (0, $e8379818650e2442$export$93654d4f2d6cd524)();
      this._textEncoder = new TextEncoder();
    }
  };

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/utils.js
  var logDisabled_ = true;
  var deprecationWarnings_ = true;
  function extractVersion(uastring, expr, pos) {
    const match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
  }
  function wrapPeerConnectionEvent(window2, eventNameToWrap, wrapper) {
    if (!window2.RTCPeerConnection) {
      return;
    }
    const proto = window2.RTCPeerConnection.prototype;
    const nativeAddEventListener = proto.addEventListener;
    proto.addEventListener = function(nativeEventName, cb) {
      if (nativeEventName !== eventNameToWrap) {
        return nativeAddEventListener.apply(this, arguments);
      }
      const wrappedCallback = (e) => {
        const modifiedEvent = wrapper(e);
        if (modifiedEvent) {
          if (cb.handleEvent) {
            cb.handleEvent(modifiedEvent);
          } else {
            cb(modifiedEvent);
          }
        }
      };
      this._eventMap = this._eventMap || {};
      if (!this._eventMap[eventNameToWrap]) {
        this._eventMap[eventNameToWrap] = /* @__PURE__ */ new Map();
      }
      this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
      return nativeAddEventListener.apply(this, [
        nativeEventName,
        wrappedCallback
      ]);
    };
    const nativeRemoveEventListener = proto.removeEventListener;
    proto.removeEventListener = function(nativeEventName, cb) {
      if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) {
        return nativeRemoveEventListener.apply(this, arguments);
      }
      if (!this._eventMap[eventNameToWrap].has(cb)) {
        return nativeRemoveEventListener.apply(this, arguments);
      }
      const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
      this._eventMap[eventNameToWrap].delete(cb);
      if (this._eventMap[eventNameToWrap].size === 0) {
        delete this._eventMap[eventNameToWrap];
      }
      if (Object.keys(this._eventMap).length === 0) {
        delete this._eventMap;
      }
      return nativeRemoveEventListener.apply(this, [
        nativeEventName,
        unwrappedCb
      ]);
    };
    Object.defineProperty(proto, "on" + eventNameToWrap, {
      get() {
        return this["_on" + eventNameToWrap];
      },
      set(cb) {
        if (this["_on" + eventNameToWrap]) {
          this.removeEventListener(
            eventNameToWrap,
            this["_on" + eventNameToWrap]
          );
          delete this["_on" + eventNameToWrap];
        }
        if (cb) {
          this.addEventListener(
            eventNameToWrap,
            this["_on" + eventNameToWrap] = cb
          );
        }
      },
      enumerable: true,
      configurable: true
    });
  }
  function disableLog(bool) {
    if (typeof bool !== "boolean") {
      return new Error("Argument type: " + typeof bool + ". Please use a boolean.");
    }
    logDisabled_ = bool;
    return bool ? "adapter.js logging disabled" : "adapter.js logging enabled";
  }
  function disableWarnings(bool) {
    if (typeof bool !== "boolean") {
      return new Error("Argument type: " + typeof bool + ". Please use a boolean.");
    }
    deprecationWarnings_ = !bool;
    return "adapter.js deprecation warnings " + (bool ? "disabled" : "enabled");
  }
  function log() {
    if (typeof window === "object") {
      if (logDisabled_) {
        return;
      }
      if (typeof console !== "undefined" && typeof console.log === "function") {
        console.log.apply(console, arguments);
      }
    }
  }
  function deprecated(oldMethod, newMethod) {
    if (!deprecationWarnings_) {
      return;
    }
    console.warn(oldMethod + " is deprecated, please use " + newMethod + " instead.");
  }
  function detectBrowser(window2) {
    const result = { browser: null, version: null };
    if (typeof window2 === "undefined" || !window2.navigator || !window2.navigator.userAgent) {
      result.browser = "Not a browser.";
      return result;
    }
    const { navigator: navigator2 } = window2;
    if (navigator2.mozGetUserMedia) {
      result.browser = "firefox";
      result.version = extractVersion(
        navigator2.userAgent,
        /Firefox\/(\d+)\./,
        1
      );
    } else if (navigator2.webkitGetUserMedia || window2.isSecureContext === false && window2.webkitRTCPeerConnection) {
      result.browser = "chrome";
      result.version = extractVersion(
        navigator2.userAgent,
        /Chrom(e|ium)\/(\d+)\./,
        2
      );
    } else if (window2.RTCPeerConnection && navigator2.userAgent.match(/AppleWebKit\/(\d+)\./)) {
      result.browser = "safari";
      result.version = extractVersion(
        navigator2.userAgent,
        /AppleWebKit\/(\d+)\./,
        1
      );
      result.supportsUnifiedPlan = window2.RTCRtpTransceiver && "currentDirection" in window2.RTCRtpTransceiver.prototype;
    } else {
      result.browser = "Not a supported browser.";
      return result;
    }
    return result;
  }
  function isObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
  }
  function compactObject(data) {
    if (!isObject(data)) {
      return data;
    }
    return Object.keys(data).reduce(function(accumulator, key) {
      const isObj = isObject(data[key]);
      const value = isObj ? compactObject(data[key]) : data[key];
      const isEmptyObject = isObj && !Object.keys(value).length;
      if (value === void 0 || isEmptyObject) {
        return accumulator;
      }
      return Object.assign(accumulator, { [key]: value });
    }, {});
  }
  function walkStats(stats, base, resultSet) {
    if (!base || resultSet.has(base.id)) {
      return;
    }
    resultSet.set(base.id, base);
    Object.keys(base).forEach((name) => {
      if (name.endsWith("Id")) {
        walkStats(stats, stats.get(base[name]), resultSet);
      } else if (name.endsWith("Ids")) {
        base[name].forEach((id) => {
          walkStats(stats, stats.get(id), resultSet);
        });
      }
    });
  }
  function filterStats(result, track, outbound) {
    const streamStatsType = outbound ? "outbound-rtp" : "inbound-rtp";
    const filteredResult = /* @__PURE__ */ new Map();
    if (track === null) {
      return filteredResult;
    }
    const trackStats = [];
    result.forEach((value) => {
      if (value.type === "track" && value.trackIdentifier === track.id) {
        trackStats.push(value);
      }
    });
    trackStats.forEach((trackStat) => {
      result.forEach((stats) => {
        if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
          walkStats(result, stats, filteredResult);
        }
      });
    });
    return filteredResult;
  }

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js
  var chrome_shim_exports = {};
  __export(chrome_shim_exports, {
    fixNegotiationNeeded: () => fixNegotiationNeeded,
    shimAddTrackRemoveTrack: () => shimAddTrackRemoveTrack,
    shimAddTrackRemoveTrackWithNative: () => shimAddTrackRemoveTrackWithNative,
    shimGetDisplayMedia: () => shimGetDisplayMedia,
    shimGetSendersWithDtmf: () => shimGetSendersWithDtmf,
    shimGetStats: () => shimGetStats,
    shimGetUserMedia: () => shimGetUserMedia,
    shimMediaStream: () => shimMediaStream,
    shimOnTrack: () => shimOnTrack,
    shimPeerConnection: () => shimPeerConnection,
    shimSenderReceiverGetStats: () => shimSenderReceiverGetStats
  });

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/chrome/getusermedia.js
  var logging = log;
  function shimGetUserMedia(window2, browserDetails) {
    const navigator2 = window2 && window2.navigator;
    if (!navigator2.mediaDevices) {
      return;
    }
    const constraintsToChrome_ = function(c2) {
      if (typeof c2 !== "object" || c2.mandatory || c2.optional) {
        return c2;
      }
      const cc = {};
      Object.keys(c2).forEach((key) => {
        if (key === "require" || key === "advanced" || key === "mediaSource") {
          return;
        }
        const r = typeof c2[key] === "object" ? c2[key] : { ideal: c2[key] };
        if (r.exact !== void 0 && typeof r.exact === "number") {
          r.min = r.max = r.exact;
        }
        const oldname_ = function(prefix, name) {
          if (prefix) {
            return prefix + name.charAt(0).toUpperCase() + name.slice(1);
          }
          return name === "deviceId" ? "sourceId" : name;
        };
        if (r.ideal !== void 0) {
          cc.optional = cc.optional || [];
          let oc = {};
          if (typeof r.ideal === "number") {
            oc[oldname_("min", key)] = r.ideal;
            cc.optional.push(oc);
            oc = {};
            oc[oldname_("max", key)] = r.ideal;
            cc.optional.push(oc);
          } else {
            oc[oldname_("", key)] = r.ideal;
            cc.optional.push(oc);
          }
        }
        if (r.exact !== void 0 && typeof r.exact !== "number") {
          cc.mandatory = cc.mandatory || {};
          cc.mandatory[oldname_("", key)] = r.exact;
        } else {
          ["min", "max"].forEach((mix) => {
            if (r[mix] !== void 0) {
              cc.mandatory = cc.mandatory || {};
              cc.mandatory[oldname_(mix, key)] = r[mix];
            }
          });
        }
      });
      if (c2.advanced) {
        cc.optional = (cc.optional || []).concat(c2.advanced);
      }
      return cc;
    };
    const shimConstraints_ = function(constraints, func) {
      if (browserDetails.version >= 61) {
        return func(constraints);
      }
      constraints = JSON.parse(JSON.stringify(constraints));
      if (constraints && typeof constraints.audio === "object") {
        const remap = function(obj, a, b2) {
          if (a in obj && !(b2 in obj)) {
            obj[b2] = obj[a];
            delete obj[a];
          }
        };
        constraints = JSON.parse(JSON.stringify(constraints));
        remap(constraints.audio, "autoGainControl", "googAutoGainControl");
        remap(constraints.audio, "noiseSuppression", "googNoiseSuppression");
        constraints.audio = constraintsToChrome_(constraints.audio);
      }
      if (constraints && typeof constraints.video === "object") {
        let face = constraints.video.facingMode;
        face = face && (typeof face === "object" ? face : { ideal: face });
        const getSupportedFacingModeLies = browserDetails.version < 66;
        if (face && (face.exact === "user" || face.exact === "environment" || face.ideal === "user" || face.ideal === "environment") && !(navigator2.mediaDevices.getSupportedConstraints && navigator2.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
          delete constraints.video.facingMode;
          let matches;
          if (face.exact === "environment" || face.ideal === "environment") {
            matches = ["back", "rear"];
          } else if (face.exact === "user" || face.ideal === "user") {
            matches = ["front"];
          }
          if (matches) {
            return navigator2.mediaDevices.enumerateDevices().then((devices) => {
              devices = devices.filter((d2) => d2.kind === "videoinput");
              let dev = devices.find((d2) => matches.some((match) => d2.label.toLowerCase().includes(match)));
              if (!dev && devices.length && matches.includes("back")) {
                dev = devices[devices.length - 1];
              }
              if (dev) {
                constraints.video.deviceId = face.exact ? { exact: dev.deviceId } : { ideal: dev.deviceId };
              }
              constraints.video = constraintsToChrome_(constraints.video);
              logging("chrome: " + JSON.stringify(constraints));
              return func(constraints);
            });
          }
        }
        constraints.video = constraintsToChrome_(constraints.video);
      }
      logging("chrome: " + JSON.stringify(constraints));
      return func(constraints);
    };
    const shimError_ = function(e) {
      if (browserDetails.version >= 64) {
        return e;
      }
      return {
        name: {
          PermissionDeniedError: "NotAllowedError",
          PermissionDismissedError: "NotAllowedError",
          InvalidStateError: "NotAllowedError",
          DevicesNotFoundError: "NotFoundError",
          ConstraintNotSatisfiedError: "OverconstrainedError",
          TrackStartError: "NotReadableError",
          MediaDeviceFailedDueToShutdown: "NotAllowedError",
          MediaDeviceKillSwitchOn: "NotAllowedError",
          TabCaptureError: "AbortError",
          ScreenCaptureError: "AbortError",
          DeviceCaptureError: "AbortError"
        }[e.name] || e.name,
        message: e.message,
        constraint: e.constraint || e.constraintName,
        toString() {
          return this.name + (this.message && ": ") + this.message;
        }
      };
    };
    const getUserMedia_ = function(constraints, onSuccess, onError) {
      shimConstraints_(constraints, (c2) => {
        navigator2.webkitGetUserMedia(c2, onSuccess, (e) => {
          if (onError) {
            onError(shimError_(e));
          }
        });
      });
    };
    navigator2.getUserMedia = getUserMedia_.bind(navigator2);
    if (navigator2.mediaDevices.getUserMedia) {
      const origGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
      navigator2.mediaDevices.getUserMedia = function(cs) {
        return shimConstraints_(cs, (c2) => origGetUserMedia(c2).then((stream) => {
          if (c2.audio && !stream.getAudioTracks().length || c2.video && !stream.getVideoTracks().length) {
            stream.getTracks().forEach((track) => {
              track.stop();
            });
            throw new DOMException("", "NotFoundError");
          }
          return stream;
        }, (e) => Promise.reject(shimError_(e))));
      };
    }
  }

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/chrome/getdisplaymedia.js
  function shimGetDisplayMedia(window2, getSourceId) {
    if (window2.navigator.mediaDevices && "getDisplayMedia" in window2.navigator.mediaDevices) {
      return;
    }
    if (!window2.navigator.mediaDevices) {
      return;
    }
    if (typeof getSourceId !== "function") {
      console.error("shimGetDisplayMedia: getSourceId argument is not a function");
      return;
    }
    window2.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
      return getSourceId(constraints).then((sourceId) => {
        const widthSpecified = constraints.video && constraints.video.width;
        const heightSpecified = constraints.video && constraints.video.height;
        const frameRateSpecified = constraints.video && constraints.video.frameRate;
        constraints.video = {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: sourceId,
            maxFrameRate: frameRateSpecified || 3
          }
        };
        if (widthSpecified) {
          constraints.video.mandatory.maxWidth = widthSpecified;
        }
        if (heightSpecified) {
          constraints.video.mandatory.maxHeight = heightSpecified;
        }
        return window2.navigator.mediaDevices.getUserMedia(constraints);
      });
    };
  }

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js
  function shimMediaStream(window2) {
    window2.MediaStream = window2.MediaStream || window2.webkitMediaStream;
  }
  function shimOnTrack(window2) {
    if (typeof window2 === "object" && window2.RTCPeerConnection && !("ontrack" in window2.RTCPeerConnection.prototype)) {
      Object.defineProperty(window2.RTCPeerConnection.prototype, "ontrack", {
        get() {
          return this._ontrack;
        },
        set(f2) {
          if (this._ontrack) {
            this.removeEventListener("track", this._ontrack);
          }
          this.addEventListener("track", this._ontrack = f2);
        },
        enumerable: true,
        configurable: true
      });
      const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
      window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
        if (!this._ontrackpoly) {
          this._ontrackpoly = (e) => {
            e.stream.addEventListener("addtrack", (te2) => {
              let receiver;
              if (window2.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers().find((r) => r.track && r.track.id === te2.track.id);
              } else {
                receiver = { track: te2.track };
              }
              const event = new Event("track");
              event.track = te2.track;
              event.receiver = receiver;
              event.transceiver = { receiver };
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
            e.stream.getTracks().forEach((track) => {
              let receiver;
              if (window2.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers().find((r) => r.track && r.track.id === track.id);
              } else {
                receiver = { track };
              }
              const event = new Event("track");
              event.track = track;
              event.receiver = receiver;
              event.transceiver = { receiver };
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
          };
          this.addEventListener("addstream", this._ontrackpoly);
        }
        return origSetRemoteDescription.apply(this, arguments);
      };
    } else {
      wrapPeerConnectionEvent(window2, "track", (e) => {
        if (!e.transceiver) {
          Object.defineProperty(
            e,
            "transceiver",
            { value: { receiver: e.receiver } }
          );
        }
        return e;
      });
    }
  }
  function shimGetSendersWithDtmf(window2) {
    if (typeof window2 === "object" && window2.RTCPeerConnection && !("getSenders" in window2.RTCPeerConnection.prototype) && "createDTMFSender" in window2.RTCPeerConnection.prototype) {
      const shimSenderWithDtmf = function(pc, track) {
        return {
          track,
          get dtmf() {
            if (this._dtmf === void 0) {
              if (track.kind === "audio") {
                this._dtmf = pc.createDTMFSender(track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          },
          _pc: pc
        };
      };
      if (!window2.RTCPeerConnection.prototype.getSenders) {
        window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
          this._senders = this._senders || [];
          return this._senders.slice();
        };
        const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
        window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
          let sender = origAddTrack.apply(this, arguments);
          if (!sender) {
            sender = shimSenderWithDtmf(this, track);
            this._senders.push(sender);
          }
          return sender;
        };
        const origRemoveTrack = window2.RTCPeerConnection.prototype.removeTrack;
        window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
          origRemoveTrack.apply(this, arguments);
          const idx = this._senders.indexOf(sender);
          if (idx !== -1) {
            this._senders.splice(idx, 1);
          }
        };
      }
      const origAddStream = window2.RTCPeerConnection.prototype.addStream;
      window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        this._senders = this._senders || [];
        origAddStream.apply(this, [stream]);
        stream.getTracks().forEach((track) => {
          this._senders.push(shimSenderWithDtmf(this, track));
        });
      };
      const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
      window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._senders = this._senders || [];
        origRemoveStream.apply(this, [stream]);
        stream.getTracks().forEach((track) => {
          const sender = this._senders.find((s) => s.track === track);
          if (sender) {
            this._senders.splice(this._senders.indexOf(sender), 1);
          }
        });
      };
    } else if (typeof window2 === "object" && window2.RTCPeerConnection && "getSenders" in window2.RTCPeerConnection.prototype && "createDTMFSender" in window2.RTCPeerConnection.prototype && window2.RTCRtpSender && !("dtmf" in window2.RTCRtpSender.prototype)) {
      const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
      window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach((sender) => sender._pc = this);
        return senders;
      };
      Object.defineProperty(window2.RTCRtpSender.prototype, "dtmf", {
        get() {
          if (this._dtmf === void 0) {
            if (this.track.kind === "audio") {
              this._dtmf = this._pc.createDTMFSender(this.track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }
  }
  function shimGetStats(window2) {
    if (!window2.RTCPeerConnection) {
      return;
    }
    const origGetStats = window2.RTCPeerConnection.prototype.getStats;
    window2.RTCPeerConnection.prototype.getStats = function getStats() {
      const [selector, onSucc, onErr] = arguments;
      if (arguments.length > 0 && typeof selector === "function") {
        return origGetStats.apply(this, arguments);
      }
      if (origGetStats.length === 0 && (arguments.length === 0 || typeof selector !== "function")) {
        return origGetStats.apply(this, []);
      }
      const fixChromeStats_ = function(response) {
        const standardReport = {};
        const reports = response.result();
        reports.forEach((report) => {
          const standardStats = {
            id: report.id,
            timestamp: report.timestamp,
            type: {
              localcandidate: "local-candidate",
              remotecandidate: "remote-candidate"
            }[report.type] || report.type
          };
          report.names().forEach((name) => {
            standardStats[name] = report.stat(name);
          });
          standardReport[standardStats.id] = standardStats;
        });
        return standardReport;
      };
      const makeMapStats = function(stats) {
        return new Map(Object.keys(stats).map((key) => [key, stats[key]]));
      };
      if (arguments.length >= 2) {
        const successCallbackWrapper_ = function(response) {
          onSucc(makeMapStats(fixChromeStats_(response)));
        };
        return origGetStats.apply(this, [
          successCallbackWrapper_,
          selector
        ]);
      }
      return new Promise((resolve, reject) => {
        origGetStats.apply(this, [
          function(response) {
            resolve(makeMapStats(fixChromeStats_(response)));
          },
          reject
        ]);
      }).then(onSucc, onErr);
    };
  }
  function shimSenderReceiverGetStats(window2) {
    if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender && window2.RTCRtpReceiver)) {
      return;
    }
    if (!("getStats" in window2.RTCRtpSender.prototype)) {
      const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
      if (origGetSenders) {
        window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
          const senders = origGetSenders.apply(this, []);
          senders.forEach((sender) => sender._pc = this);
          return senders;
        };
      }
      const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
      if (origAddTrack) {
        window2.RTCPeerConnection.prototype.addTrack = function addTrack() {
          const sender = origAddTrack.apply(this, arguments);
          sender._pc = this;
          return sender;
        };
      }
      window2.RTCRtpSender.prototype.getStats = function getStats() {
        const sender = this;
        return this._pc.getStats().then((result) => (
          /* Note: this will include stats of all senders that
           *   send a track with the same id as sender.track as
           *   it is not possible to identify the RTCRtpSender.
           */
          filterStats(result, sender.track, true)
        ));
      };
    }
    if (!("getStats" in window2.RTCRtpReceiver.prototype)) {
      const origGetReceivers = window2.RTCPeerConnection.prototype.getReceivers;
      if (origGetReceivers) {
        window2.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
          const receivers = origGetReceivers.apply(this, []);
          receivers.forEach((receiver) => receiver._pc = this);
          return receivers;
        };
      }
      wrapPeerConnectionEvent(window2, "track", (e) => {
        e.receiver._pc = e.srcElement;
        return e;
      });
      window2.RTCRtpReceiver.prototype.getStats = function getStats() {
        const receiver = this;
        return this._pc.getStats().then((result) => filterStats(result, receiver.track, false));
      };
    }
    if (!("getStats" in window2.RTCRtpSender.prototype && "getStats" in window2.RTCRtpReceiver.prototype)) {
      return;
    }
    const origGetStats = window2.RTCPeerConnection.prototype.getStats;
    window2.RTCPeerConnection.prototype.getStats = function getStats() {
      if (arguments.length > 0 && arguments[0] instanceof window2.MediaStreamTrack) {
        const track = arguments[0];
        let sender;
        let receiver;
        let err;
        this.getSenders().forEach((s) => {
          if (s.track === track) {
            if (sender) {
              err = true;
            } else {
              sender = s;
            }
          }
        });
        this.getReceivers().forEach((r) => {
          if (r.track === track) {
            if (receiver) {
              err = true;
            } else {
              receiver = r;
            }
          }
          return r.track === track;
        });
        if (err || sender && receiver) {
          return Promise.reject(new DOMException(
            "There are more than one sender or receiver for the track.",
            "InvalidAccessError"
          ));
        } else if (sender) {
          return sender.getStats();
        } else if (receiver) {
          return receiver.getStats();
        }
        return Promise.reject(new DOMException(
          "There is no sender or receiver for the track.",
          "InvalidAccessError"
        ));
      }
      return origGetStats.apply(this, arguments);
    };
  }
  function shimAddTrackRemoveTrackWithNative(window2) {
    window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      return Object.keys(this._shimmedLocalStreams).map((streamId) => this._shimmedLocalStreams[streamId][0]);
    };
    const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
    window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
      if (!stream) {
        return origAddTrack.apply(this, arguments);
      }
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      const sender = origAddTrack.apply(this, arguments);
      if (!this._shimmedLocalStreams[stream.id]) {
        this._shimmedLocalStreams[stream.id] = [stream, sender];
      } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
        this._shimmedLocalStreams[stream.id].push(sender);
      }
      return sender;
    };
    const origAddStream = window2.RTCPeerConnection.prototype.addStream;
    window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      stream.getTracks().forEach((track) => {
        const alreadyExists = this.getSenders().find((s) => s.track === track);
        if (alreadyExists) {
          throw new DOMException(
            "Track already exists.",
            "InvalidAccessError"
          );
        }
      });
      const existingSenders = this.getSenders();
      origAddStream.apply(this, arguments);
      const newSenders = this.getSenders().filter((newSender) => existingSenders.indexOf(newSender) === -1);
      this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
    };
    const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
    window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      delete this._shimmedLocalStreams[stream.id];
      return origRemoveStream.apply(this, arguments);
    };
    const origRemoveTrack = window2.RTCPeerConnection.prototype.removeTrack;
    window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      if (sender) {
        Object.keys(this._shimmedLocalStreams).forEach((streamId) => {
          const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
          if (idx !== -1) {
            this._shimmedLocalStreams[streamId].splice(idx, 1);
          }
          if (this._shimmedLocalStreams[streamId].length === 1) {
            delete this._shimmedLocalStreams[streamId];
          }
        });
      }
      return origRemoveTrack.apply(this, arguments);
    };
  }
  function shimAddTrackRemoveTrack(window2, browserDetails) {
    if (!window2.RTCPeerConnection) {
      return;
    }
    if (window2.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
      return shimAddTrackRemoveTrackWithNative(window2);
    }
    const origGetLocalStreams = window2.RTCPeerConnection.prototype.getLocalStreams;
    window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
      const nativeStreams = origGetLocalStreams.apply(this);
      this._reverseStreams = this._reverseStreams || {};
      return nativeStreams.map((stream) => this._reverseStreams[stream.id]);
    };
    const origAddStream = window2.RTCPeerConnection.prototype.addStream;
    window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
      stream.getTracks().forEach((track) => {
        const alreadyExists = this.getSenders().find((s) => s.track === track);
        if (alreadyExists) {
          throw new DOMException(
            "Track already exists.",
            "InvalidAccessError"
          );
        }
      });
      if (!this._reverseStreams[stream.id]) {
        const newStream = new window2.MediaStream(stream.getTracks());
        this._streams[stream.id] = newStream;
        this._reverseStreams[newStream.id] = stream;
        stream = newStream;
      }
      origAddStream.apply(this, [stream]);
    };
    const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
    window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
      origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
      delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
      delete this._streams[stream.id];
    };
    window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
      if (this.signalingState === "closed") {
        throw new DOMException(
          "The RTCPeerConnection's signalingState is 'closed'.",
          "InvalidStateError"
        );
      }
      const streams = [].slice.call(arguments, 1);
      if (streams.length !== 1 || !streams[0].getTracks().find((t) => t === track)) {
        throw new DOMException(
          "The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.",
          "NotSupportedError"
        );
      }
      const alreadyExists = this.getSenders().find((s) => s.track === track);
      if (alreadyExists) {
        throw new DOMException(
          "Track already exists.",
          "InvalidAccessError"
        );
      }
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
      const oldStream = this._streams[stream.id];
      if (oldStream) {
        oldStream.addTrack(track);
        Promise.resolve().then(() => {
          this.dispatchEvent(new Event("negotiationneeded"));
        });
      } else {
        const newStream = new window2.MediaStream([track]);
        this._streams[stream.id] = newStream;
        this._reverseStreams[newStream.id] = stream;
        this.addStream(newStream);
      }
      return this.getSenders().find((s) => s.track === track);
    };
    function replaceInternalStreamId(pc, description) {
      let sdp2 = description.sdp;
      Object.keys(pc._reverseStreams || []).forEach((internalId) => {
        const externalStream = pc._reverseStreams[internalId];
        const internalStream = pc._streams[externalStream.id];
        sdp2 = sdp2.replace(
          new RegExp(internalStream.id, "g"),
          externalStream.id
        );
      });
      return new RTCSessionDescription({
        type: description.type,
        sdp: sdp2
      });
    }
    function replaceExternalStreamId(pc, description) {
      let sdp2 = description.sdp;
      Object.keys(pc._reverseStreams || []).forEach((internalId) => {
        const externalStream = pc._reverseStreams[internalId];
        const internalStream = pc._streams[externalStream.id];
        sdp2 = sdp2.replace(
          new RegExp(externalStream.id, "g"),
          internalStream.id
        );
      });
      return new RTCSessionDescription({
        type: description.type,
        sdp: sdp2
      });
    }
    ["createOffer", "createAnswer"].forEach(function(method) {
      const nativeMethod = window2.RTCPeerConnection.prototype[method];
      const methodObj = { [method]() {
        const args = arguments;
        const isLegacyCall = arguments.length && typeof arguments[0] === "function";
        if (isLegacyCall) {
          return nativeMethod.apply(this, [
            (description) => {
              const desc = replaceInternalStreamId(this, description);
              args[0].apply(null, [desc]);
            },
            (err) => {
              if (args[1]) {
                args[1].apply(null, err);
              }
            },
            arguments[2]
          ]);
        }
        return nativeMethod.apply(this, arguments).then((description) => replaceInternalStreamId(this, description));
      } };
      window2.RTCPeerConnection.prototype[method] = methodObj[method];
    });
    const origSetLocalDescription = window2.RTCPeerConnection.prototype.setLocalDescription;
    window2.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
      if (!arguments.length || !arguments[0].type) {
        return origSetLocalDescription.apply(this, arguments);
      }
      arguments[0] = replaceExternalStreamId(this, arguments[0]);
      return origSetLocalDescription.apply(this, arguments);
    };
    const origLocalDescription = Object.getOwnPropertyDescriptor(
      window2.RTCPeerConnection.prototype,
      "localDescription"
    );
    Object.defineProperty(
      window2.RTCPeerConnection.prototype,
      "localDescription",
      {
        get() {
          const description = origLocalDescription.get.apply(this);
          if (description.type === "") {
            return description;
          }
          return replaceInternalStreamId(this, description);
        }
      }
    );
    window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
      if (this.signalingState === "closed") {
        throw new DOMException(
          "The RTCPeerConnection's signalingState is 'closed'.",
          "InvalidStateError"
        );
      }
      if (!sender._pc) {
        throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
      }
      const isLocal = sender._pc === this;
      if (!isLocal) {
        throw new DOMException(
          "Sender was not created by this connection.",
          "InvalidAccessError"
        );
      }
      this._streams = this._streams || {};
      let stream;
      Object.keys(this._streams).forEach((streamid) => {
        const hasTrack = this._streams[streamid].getTracks().find((track) => sender.track === track);
        if (hasTrack) {
          stream = this._streams[streamid];
        }
      });
      if (stream) {
        if (stream.getTracks().length === 1) {
          this.removeStream(this._reverseStreams[stream.id]);
        } else {
          stream.removeTrack(sender.track);
        }
        this.dispatchEvent(new Event("negotiationneeded"));
      }
    };
  }
  function shimPeerConnection(window2, browserDetails) {
    if (!window2.RTCPeerConnection && window2.webkitRTCPeerConnection) {
      window2.RTCPeerConnection = window2.webkitRTCPeerConnection;
    }
    if (!window2.RTCPeerConnection) {
      return;
    }
    if (browserDetails.version < 53) {
      ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
        const nativeMethod = window2.RTCPeerConnection.prototype[method];
        const methodObj = { [method]() {
          arguments[0] = new (method === "addIceCandidate" ? window2.RTCIceCandidate : window2.RTCSessionDescription)(arguments[0]);
          return nativeMethod.apply(this, arguments);
        } };
        window2.RTCPeerConnection.prototype[method] = methodObj[method];
      });
    }
  }
  function fixNegotiationNeeded(window2, browserDetails) {
    wrapPeerConnectionEvent(window2, "negotiationneeded", (e) => {
      const pc = e.target;
      if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === "plan-b") {
        if (pc.signalingState !== "stable") {
          return;
        }
      }
      return e;
    });
  }

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js
  var firefox_shim_exports = {};
  __export(firefox_shim_exports, {
    shimAddTransceiver: () => shimAddTransceiver,
    shimCreateAnswer: () => shimCreateAnswer,
    shimCreateOffer: () => shimCreateOffer,
    shimGetDisplayMedia: () => shimGetDisplayMedia2,
    shimGetParameters: () => shimGetParameters,
    shimGetUserMedia: () => shimGetUserMedia2,
    shimOnTrack: () => shimOnTrack2,
    shimPeerConnection: () => shimPeerConnection2,
    shimRTCDataChannel: () => shimRTCDataChannel,
    shimReceiverGetStats: () => shimReceiverGetStats,
    shimRemoveStream: () => shimRemoveStream,
    shimSenderGetStats: () => shimSenderGetStats
  });

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/firefox/getusermedia.js
  function shimGetUserMedia2(window2, browserDetails) {
    const navigator2 = window2 && window2.navigator;
    const MediaStreamTrack = window2 && window2.MediaStreamTrack;
    navigator2.getUserMedia = function(constraints, onSuccess, onError) {
      deprecated(
        "navigator.getUserMedia",
        "navigator.mediaDevices.getUserMedia"
      );
      navigator2.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    };
    if (!(browserDetails.version > 55 && "autoGainControl" in navigator2.mediaDevices.getSupportedConstraints())) {
      const remap = function(obj, a, b2) {
        if (a in obj && !(b2 in obj)) {
          obj[b2] = obj[a];
          delete obj[a];
        }
      };
      const nativeGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
      navigator2.mediaDevices.getUserMedia = function(c2) {
        if (typeof c2 === "object" && typeof c2.audio === "object") {
          c2 = JSON.parse(JSON.stringify(c2));
          remap(c2.audio, "autoGainControl", "mozAutoGainControl");
          remap(c2.audio, "noiseSuppression", "mozNoiseSuppression");
        }
        return nativeGetUserMedia(c2);
      };
      if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
        const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
        MediaStreamTrack.prototype.getSettings = function() {
          const obj = nativeGetSettings.apply(this, arguments);
          remap(obj, "mozAutoGainControl", "autoGainControl");
          remap(obj, "mozNoiseSuppression", "noiseSuppression");
          return obj;
        };
      }
      if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
        const nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
        MediaStreamTrack.prototype.applyConstraints = function(c2) {
          if (this.kind === "audio" && typeof c2 === "object") {
            c2 = JSON.parse(JSON.stringify(c2));
            remap(c2, "autoGainControl", "mozAutoGainControl");
            remap(c2, "noiseSuppression", "mozNoiseSuppression");
          }
          return nativeApplyConstraints.apply(this, [c2]);
        };
      }
    }
  }

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js
  function shimGetDisplayMedia2(window2, preferredMediaSource) {
    if (window2.navigator.mediaDevices && "getDisplayMedia" in window2.navigator.mediaDevices) {
      return;
    }
    if (!window2.navigator.mediaDevices) {
      return;
    }
    window2.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
      if (!(constraints && constraints.video)) {
        const err = new DOMException("getDisplayMedia without video constraints is undefined");
        err.name = "NotFoundError";
        err.code = 8;
        return Promise.reject(err);
      }
      if (constraints.video === true) {
        constraints.video = { mediaSource: preferredMediaSource };
      } else {
        constraints.video.mediaSource = preferredMediaSource;
      }
      return window2.navigator.mediaDevices.getUserMedia(constraints);
    };
  }

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js
  function shimOnTrack2(window2) {
    if (typeof window2 === "object" && window2.RTCTrackEvent && "receiver" in window2.RTCTrackEvent.prototype && !("transceiver" in window2.RTCTrackEvent.prototype)) {
      Object.defineProperty(window2.RTCTrackEvent.prototype, "transceiver", {
        get() {
          return { receiver: this.receiver };
        }
      });
    }
  }
  function shimPeerConnection2(window2, browserDetails) {
    if (typeof window2 !== "object" || !(window2.RTCPeerConnection || window2.mozRTCPeerConnection)) {
      return;
    }
    if (!window2.RTCPeerConnection && window2.mozRTCPeerConnection) {
      window2.RTCPeerConnection = window2.mozRTCPeerConnection;
    }
    if (browserDetails.version < 53) {
      ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
        const nativeMethod = window2.RTCPeerConnection.prototype[method];
        const methodObj = { [method]() {
          arguments[0] = new (method === "addIceCandidate" ? window2.RTCIceCandidate : window2.RTCSessionDescription)(arguments[0]);
          return nativeMethod.apply(this, arguments);
        } };
        window2.RTCPeerConnection.prototype[method] = methodObj[method];
      });
    }
    const modernStatsTypes = {
      inboundrtp: "inbound-rtp",
      outboundrtp: "outbound-rtp",
      candidatepair: "candidate-pair",
      localcandidate: "local-candidate",
      remotecandidate: "remote-candidate"
    };
    const nativeGetStats = window2.RTCPeerConnection.prototype.getStats;
    window2.RTCPeerConnection.prototype.getStats = function getStats() {
      const [selector, onSucc, onErr] = arguments;
      return nativeGetStats.apply(this, [selector || null]).then((stats) => {
        if (browserDetails.version < 53 && !onSucc) {
          try {
            stats.forEach((stat) => {
              stat.type = modernStatsTypes[stat.type] || stat.type;
            });
          } catch (e) {
            if (e.name !== "TypeError") {
              throw e;
            }
            stats.forEach((stat, i) => {
              stats.set(i, Object.assign({}, stat, {
                type: modernStatsTypes[stat.type] || stat.type
              }));
            });
          }
        }
        return stats;
      }).then(onSucc, onErr);
    };
  }
  function shimSenderGetStats(window2) {
    if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender)) {
      return;
    }
    if (window2.RTCRtpSender && "getStats" in window2.RTCRtpSender.prototype) {
      return;
    }
    const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach((sender) => sender._pc = this);
        return senders;
      };
    }
    const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window2.RTCPeerConnection.prototype.addTrack = function addTrack() {
        const sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window2.RTCRtpSender.prototype.getStats = function getStats() {
      return this.track ? this._pc.getStats(this.track) : Promise.resolve(/* @__PURE__ */ new Map());
    };
  }
  function shimReceiverGetStats(window2) {
    if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender)) {
      return;
    }
    if (window2.RTCRtpSender && "getStats" in window2.RTCRtpReceiver.prototype) {
      return;
    }
    const origGetReceivers = window2.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window2.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
        const receivers = origGetReceivers.apply(this, []);
        receivers.forEach((receiver) => receiver._pc = this);
        return receivers;
      };
    }
    wrapPeerConnectionEvent(window2, "track", (e) => {
      e.receiver._pc = e.srcElement;
      return e;
    });
    window2.RTCRtpReceiver.prototype.getStats = function getStats() {
      return this._pc.getStats(this.track);
    };
  }
  function shimRemoveStream(window2) {
    if (!window2.RTCPeerConnection || "removeStream" in window2.RTCPeerConnection.prototype) {
      return;
    }
    window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      deprecated("removeStream", "removeTrack");
      this.getSenders().forEach((sender) => {
        if (sender.track && stream.getTracks().includes(sender.track)) {
          this.removeTrack(sender);
        }
      });
    };
  }
  function shimRTCDataChannel(window2) {
    if (window2.DataChannel && !window2.RTCDataChannel) {
      window2.RTCDataChannel = window2.DataChannel;
    }
  }
  function shimAddTransceiver(window2) {
    if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
      return;
    }
    const origAddTransceiver = window2.RTCPeerConnection.prototype.addTransceiver;
    if (origAddTransceiver) {
      window2.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
        this.setParametersPromises = [];
        let sendEncodings = arguments[1] && arguments[1].sendEncodings;
        if (sendEncodings === void 0) {
          sendEncodings = [];
        }
        sendEncodings = [...sendEncodings];
        const shouldPerformCheck = sendEncodings.length > 0;
        if (shouldPerformCheck) {
          sendEncodings.forEach((encodingParam) => {
            if ("rid" in encodingParam) {
              const ridRegex = /^[a-z0-9]{0,16}$/i;
              if (!ridRegex.test(encodingParam.rid)) {
                throw new TypeError("Invalid RID value provided.");
              }
            }
            if ("scaleResolutionDownBy" in encodingParam) {
              if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1)) {
                throw new RangeError("scale_resolution_down_by must be >= 1.0");
              }
            }
            if ("maxFramerate" in encodingParam) {
              if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                throw new RangeError("max_framerate must be >= 0.0");
              }
            }
          });
        }
        const transceiver = origAddTransceiver.apply(this, arguments);
        if (shouldPerformCheck) {
          const { sender } = transceiver;
          const params = sender.getParameters();
          if (!("encodings" in params) || // Avoid being fooled by patched getParameters() below.
          params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
            params.encodings = sendEncodings;
            sender.sendEncodings = sendEncodings;
            this.setParametersPromises.push(
              sender.setParameters(params).then(() => {
                delete sender.sendEncodings;
              }).catch(() => {
                delete sender.sendEncodings;
              })
            );
          }
        }
        return transceiver;
      };
    }
  }
  function shimGetParameters(window2) {
    if (!(typeof window2 === "object" && window2.RTCRtpSender)) {
      return;
    }
    const origGetParameters = window2.RTCRtpSender.prototype.getParameters;
    if (origGetParameters) {
      window2.RTCRtpSender.prototype.getParameters = function getParameters() {
        const params = origGetParameters.apply(this, arguments);
        if (!("encodings" in params)) {
          params.encodings = [].concat(this.sendEncodings || [{}]);
        }
        return params;
      };
    }
  }
  function shimCreateOffer(window2) {
    if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
      return;
    }
    const origCreateOffer = window2.RTCPeerConnection.prototype.createOffer;
    window2.RTCPeerConnection.prototype.createOffer = function createOffer() {
      if (this.setParametersPromises && this.setParametersPromises.length) {
        return Promise.all(this.setParametersPromises).then(() => {
          return origCreateOffer.apply(this, arguments);
        }).finally(() => {
          this.setParametersPromises = [];
        });
      }
      return origCreateOffer.apply(this, arguments);
    };
  }
  function shimCreateAnswer(window2) {
    if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
      return;
    }
    const origCreateAnswer = window2.RTCPeerConnection.prototype.createAnswer;
    window2.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
      if (this.setParametersPromises && this.setParametersPromises.length) {
        return Promise.all(this.setParametersPromises).then(() => {
          return origCreateAnswer.apply(this, arguments);
        }).finally(() => {
          this.setParametersPromises = [];
        });
      }
      return origCreateAnswer.apply(this, arguments);
    };
  }

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/safari/safari_shim.js
  var safari_shim_exports = {};
  __export(safari_shim_exports, {
    shimAudioContext: () => shimAudioContext,
    shimCallbacksAPI: () => shimCallbacksAPI,
    shimConstraints: () => shimConstraints,
    shimCreateOfferLegacy: () => shimCreateOfferLegacy,
    shimGetUserMedia: () => shimGetUserMedia3,
    shimLocalStreamsAPI: () => shimLocalStreamsAPI,
    shimRTCIceServerUrls: () => shimRTCIceServerUrls,
    shimRemoteStreamsAPI: () => shimRemoteStreamsAPI,
    shimTrackEventTransceiver: () => shimTrackEventTransceiver
  });
  function shimLocalStreamsAPI(window2) {
    if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
      return;
    }
    if (!("getLocalStreams" in window2.RTCPeerConnection.prototype)) {
      window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        return this._localStreams;
      };
    }
    if (!("addStream" in window2.RTCPeerConnection.prototype)) {
      const _addTrack = window2.RTCPeerConnection.prototype.addTrack;
      window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        if (!this._localStreams.includes(stream)) {
          this._localStreams.push(stream);
        }
        stream.getAudioTracks().forEach((track) => _addTrack.call(
          this,
          track,
          stream
        ));
        stream.getVideoTracks().forEach((track) => _addTrack.call(
          this,
          track,
          stream
        ));
      };
      window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, ...streams) {
        if (streams) {
          streams.forEach((stream) => {
            if (!this._localStreams) {
              this._localStreams = [stream];
            } else if (!this._localStreams.includes(stream)) {
              this._localStreams.push(stream);
            }
          });
        }
        return _addTrack.apply(this, arguments);
      };
    }
    if (!("removeStream" in window2.RTCPeerConnection.prototype)) {
      window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        const index = this._localStreams.indexOf(stream);
        if (index === -1) {
          return;
        }
        this._localStreams.splice(index, 1);
        const tracks = stream.getTracks();
        this.getSenders().forEach((sender) => {
          if (tracks.includes(sender.track)) {
            this.removeTrack(sender);
          }
        });
      };
    }
  }
  function shimRemoteStreamsAPI(window2) {
    if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
      return;
    }
    if (!("getRemoteStreams" in window2.RTCPeerConnection.prototype)) {
      window2.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
        return this._remoteStreams ? this._remoteStreams : [];
      };
    }
    if (!("onaddstream" in window2.RTCPeerConnection.prototype)) {
      Object.defineProperty(window2.RTCPeerConnection.prototype, "onaddstream", {
        get() {
          return this._onaddstream;
        },
        set(f2) {
          if (this._onaddstream) {
            this.removeEventListener("addstream", this._onaddstream);
            this.removeEventListener("track", this._onaddstreampoly);
          }
          this.addEventListener("addstream", this._onaddstream = f2);
          this.addEventListener("track", this._onaddstreampoly = (e) => {
            e.streams.forEach((stream) => {
              if (!this._remoteStreams) {
                this._remoteStreams = [];
              }
              if (this._remoteStreams.includes(stream)) {
                return;
              }
              this._remoteStreams.push(stream);
              const event = new Event("addstream");
              event.stream = stream;
              this.dispatchEvent(event);
            });
          });
        }
      });
      const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
      window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
        const pc = this;
        if (!this._onaddstreampoly) {
          this.addEventListener("track", this._onaddstreampoly = function(e) {
            e.streams.forEach((stream) => {
              if (!pc._remoteStreams) {
                pc._remoteStreams = [];
              }
              if (pc._remoteStreams.indexOf(stream) >= 0) {
                return;
              }
              pc._remoteStreams.push(stream);
              const event = new Event("addstream");
              event.stream = stream;
              pc.dispatchEvent(event);
            });
          });
        }
        return origSetRemoteDescription.apply(pc, arguments);
      };
    }
  }
  function shimCallbacksAPI(window2) {
    if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
      return;
    }
    const prototype = window2.RTCPeerConnection.prototype;
    const origCreateOffer = prototype.createOffer;
    const origCreateAnswer = prototype.createAnswer;
    const setLocalDescription = prototype.setLocalDescription;
    const setRemoteDescription = prototype.setRemoteDescription;
    const addIceCandidate = prototype.addIceCandidate;
    prototype.createOffer = function createOffer(successCallback, failureCallback) {
      const options = arguments.length >= 2 ? arguments[2] : arguments[0];
      const promise = origCreateOffer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
      const options = arguments.length >= 2 ? arguments[2] : arguments[0];
      const promise = origCreateAnswer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    let withCallback = function(description, successCallback, failureCallback) {
      const promise = setLocalDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setLocalDescription = withCallback;
    withCallback = function(description, successCallback, failureCallback) {
      const promise = setRemoteDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setRemoteDescription = withCallback;
    withCallback = function(candidate, successCallback, failureCallback) {
      const promise = addIceCandidate.apply(this, [candidate]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.addIceCandidate = withCallback;
  }
  function shimGetUserMedia3(window2) {
    const navigator2 = window2 && window2.navigator;
    if (navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
      const mediaDevices = navigator2.mediaDevices;
      const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
      navigator2.mediaDevices.getUserMedia = (constraints) => {
        return _getUserMedia(shimConstraints(constraints));
      };
    }
    if (!navigator2.getUserMedia && navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
      navigator2.getUserMedia = function getUserMedia(constraints, cb, errcb) {
        navigator2.mediaDevices.getUserMedia(constraints).then(cb, errcb);
      }.bind(navigator2);
    }
  }
  function shimConstraints(constraints) {
    if (constraints && constraints.video !== void 0) {
      return Object.assign(
        {},
        constraints,
        { video: compactObject(constraints.video) }
      );
    }
    return constraints;
  }
  function shimRTCIceServerUrls(window2) {
    if (!window2.RTCPeerConnection) {
      return;
    }
    const OrigPeerConnection = window2.RTCPeerConnection;
    window2.RTCPeerConnection = function RTCPeerConnection2(pcConfig, pcConstraints) {
      if (pcConfig && pcConfig.iceServers) {
        const newIceServers = [];
        for (let i = 0; i < pcConfig.iceServers.length; i++) {
          let server = pcConfig.iceServers[i];
          if (server.urls === void 0 && server.url) {
            deprecated("RTCIceServer.url", "RTCIceServer.urls");
            server = JSON.parse(JSON.stringify(server));
            server.urls = server.url;
            delete server.url;
            newIceServers.push(server);
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
      return new OrigPeerConnection(pcConfig, pcConstraints);
    };
    window2.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
    if ("generateCertificate" in OrigPeerConnection) {
      Object.defineProperty(window2.RTCPeerConnection, "generateCertificate", {
        get() {
          return OrigPeerConnection.generateCertificate;
        }
      });
    }
  }
  function shimTrackEventTransceiver(window2) {
    if (typeof window2 === "object" && window2.RTCTrackEvent && "receiver" in window2.RTCTrackEvent.prototype && !("transceiver" in window2.RTCTrackEvent.prototype)) {
      Object.defineProperty(window2.RTCTrackEvent.prototype, "transceiver", {
        get() {
          return { receiver: this.receiver };
        }
      });
    }
  }
  function shimCreateOfferLegacy(window2) {
    const origCreateOffer = window2.RTCPeerConnection.prototype.createOffer;
    window2.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
      if (offerOptions) {
        if (typeof offerOptions.offerToReceiveAudio !== "undefined") {
          offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
        }
        const audioTransceiver = this.getTransceivers().find((transceiver) => transceiver.receiver.track.kind === "audio");
        if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
          if (audioTransceiver.direction === "sendrecv") {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection("sendonly");
            } else {
              audioTransceiver.direction = "sendonly";
            }
          } else if (audioTransceiver.direction === "recvonly") {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection("inactive");
            } else {
              audioTransceiver.direction = "inactive";
            }
          }
        } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
          this.addTransceiver("audio", { direction: "recvonly" });
        }
        if (typeof offerOptions.offerToReceiveVideo !== "undefined") {
          offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
        }
        const videoTransceiver = this.getTransceivers().find((transceiver) => transceiver.receiver.track.kind === "video");
        if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
          if (videoTransceiver.direction === "sendrecv") {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection("sendonly");
            } else {
              videoTransceiver.direction = "sendonly";
            }
          } else if (videoTransceiver.direction === "recvonly") {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection("inactive");
            } else {
              videoTransceiver.direction = "inactive";
            }
          }
        } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
          this.addTransceiver("video", { direction: "recvonly" });
        }
      }
      return origCreateOffer.apply(this, arguments);
    };
  }
  function shimAudioContext(window2) {
    if (typeof window2 !== "object" || window2.AudioContext) {
      return;
    }
    window2.AudioContext = window2.webkitAudioContext;
  }

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/common_shim.js
  var common_shim_exports = {};
  __export(common_shim_exports, {
    removeExtmapAllowMixed: () => removeExtmapAllowMixed,
    shimAddIceCandidateNullOrEmpty: () => shimAddIceCandidateNullOrEmpty,
    shimConnectionState: () => shimConnectionState,
    shimMaxMessageSize: () => shimMaxMessageSize,
    shimParameterlessSetLocalDescription: () => shimParameterlessSetLocalDescription,
    shimRTCIceCandidate: () => shimRTCIceCandidate,
    shimRTCIceCandidateRelayProtocol: () => shimRTCIceCandidateRelayProtocol,
    shimSendThrowTypeError: () => shimSendThrowTypeError
  });
  var import_sdp = __toESM(require_sdp());
  function shimRTCIceCandidate(window2) {
    if (!window2.RTCIceCandidate || window2.RTCIceCandidate && "foundation" in window2.RTCIceCandidate.prototype) {
      return;
    }
    const NativeRTCIceCandidate = window2.RTCIceCandidate;
    window2.RTCIceCandidate = function RTCIceCandidate(args) {
      if (typeof args === "object" && args.candidate && args.candidate.indexOf("a=") === 0) {
        args = JSON.parse(JSON.stringify(args));
        args.candidate = args.candidate.substring(2);
      }
      if (args.candidate && args.candidate.length) {
        const nativeCandidate = new NativeRTCIceCandidate(args);
        const parsedCandidate = import_sdp.default.parseCandidate(args.candidate);
        for (const key in parsedCandidate) {
          if (!(key in nativeCandidate)) {
            Object.defineProperty(
              nativeCandidate,
              key,
              { value: parsedCandidate[key] }
            );
          }
        }
        nativeCandidate.toJSON = function toJSON() {
          return {
            candidate: nativeCandidate.candidate,
            sdpMid: nativeCandidate.sdpMid,
            sdpMLineIndex: nativeCandidate.sdpMLineIndex,
            usernameFragment: nativeCandidate.usernameFragment
          };
        };
        return nativeCandidate;
      }
      return new NativeRTCIceCandidate(args);
    };
    window2.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
    wrapPeerConnectionEvent(window2, "icecandidate", (e) => {
      if (e.candidate) {
        Object.defineProperty(e, "candidate", {
          value: new window2.RTCIceCandidate(e.candidate),
          writable: "false"
        });
      }
      return e;
    });
  }
  function shimRTCIceCandidateRelayProtocol(window2) {
    if (!window2.RTCIceCandidate || window2.RTCIceCandidate && "relayProtocol" in window2.RTCIceCandidate.prototype) {
      return;
    }
    wrapPeerConnectionEvent(window2, "icecandidate", (e) => {
      if (e.candidate) {
        const parsedCandidate = import_sdp.default.parseCandidate(e.candidate.candidate);
        if (parsedCandidate.type === "relay") {
          e.candidate.relayProtocol = {
            0: "tls",
            1: "tcp",
            2: "udp"
          }[parsedCandidate.priority >> 24];
        }
      }
      return e;
    });
  }
  function shimMaxMessageSize(window2, browserDetails) {
    if (!window2.RTCPeerConnection) {
      return;
    }
    if (!("sctp" in window2.RTCPeerConnection.prototype)) {
      Object.defineProperty(window2.RTCPeerConnection.prototype, "sctp", {
        get() {
          return typeof this._sctp === "undefined" ? null : this._sctp;
        }
      });
    }
    const sctpInDescription = function(description) {
      if (!description || !description.sdp) {
        return false;
      }
      const sections = import_sdp.default.splitSections(description.sdp);
      sections.shift();
      return sections.some((mediaSection) => {
        const mLine = import_sdp.default.parseMLine(mediaSection);
        return mLine && mLine.kind === "application" && mLine.protocol.indexOf("SCTP") !== -1;
      });
    };
    const getRemoteFirefoxVersion = function(description) {
      const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
      if (match === null || match.length < 2) {
        return -1;
      }
      const version = parseInt(match[1], 10);
      return version !== version ? -1 : version;
    };
    const getCanSendMaxMessageSize = function(remoteIsFirefox) {
      let canSendMaxMessageSize = 65536;
      if (browserDetails.browser === "firefox") {
        if (browserDetails.version < 57) {
          if (remoteIsFirefox === -1) {
            canSendMaxMessageSize = 16384;
          } else {
            canSendMaxMessageSize = 2147483637;
          }
        } else if (browserDetails.version < 60) {
          canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
        } else {
          canSendMaxMessageSize = 2147483637;
        }
      }
      return canSendMaxMessageSize;
    };
    const getMaxMessageSize = function(description, remoteIsFirefox) {
      let maxMessageSize = 65536;
      if (browserDetails.browser === "firefox" && browserDetails.version === 57) {
        maxMessageSize = 65535;
      }
      const match = import_sdp.default.matchPrefix(
        description.sdp,
        "a=max-message-size:"
      );
      if (match.length > 0) {
        maxMessageSize = parseInt(match[0].substring(19), 10);
      } else if (browserDetails.browser === "firefox" && remoteIsFirefox !== -1) {
        maxMessageSize = 2147483637;
      }
      return maxMessageSize;
    };
    const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
    window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      this._sctp = null;
      if (browserDetails.browser === "chrome" && browserDetails.version >= 76) {
        const { sdpSemantics } = this.getConfiguration();
        if (sdpSemantics === "plan-b") {
          Object.defineProperty(this, "sctp", {
            get() {
              return typeof this._sctp === "undefined" ? null : this._sctp;
            },
            enumerable: true,
            configurable: true
          });
        }
      }
      if (sctpInDescription(arguments[0])) {
        const isFirefox = getRemoteFirefoxVersion(arguments[0]);
        const canSendMMS = getCanSendMaxMessageSize(isFirefox);
        const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
        let maxMessageSize;
        if (canSendMMS === 0 && remoteMMS === 0) {
          maxMessageSize = Number.POSITIVE_INFINITY;
        } else if (canSendMMS === 0 || remoteMMS === 0) {
          maxMessageSize = Math.max(canSendMMS, remoteMMS);
        } else {
          maxMessageSize = Math.min(canSendMMS, remoteMMS);
        }
        const sctp = {};
        Object.defineProperty(sctp, "maxMessageSize", {
          get() {
            return maxMessageSize;
          }
        });
        this._sctp = sctp;
      }
      return origSetRemoteDescription.apply(this, arguments);
    };
  }
  function shimSendThrowTypeError(window2) {
    if (!(window2.RTCPeerConnection && "createDataChannel" in window2.RTCPeerConnection.prototype)) {
      return;
    }
    function wrapDcSend(dc, pc) {
      const origDataChannelSend = dc.send;
      dc.send = function send() {
        const data = arguments[0];
        const length = data.length || data.size || data.byteLength;
        if (dc.readyState === "open" && pc.sctp && length > pc.sctp.maxMessageSize) {
          throw new TypeError("Message too large (can send a maximum of " + pc.sctp.maxMessageSize + " bytes)");
        }
        return origDataChannelSend.apply(dc, arguments);
      };
    }
    const origCreateDataChannel = window2.RTCPeerConnection.prototype.createDataChannel;
    window2.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
      const dataChannel = origCreateDataChannel.apply(this, arguments);
      wrapDcSend(dataChannel, this);
      return dataChannel;
    };
    wrapPeerConnectionEvent(window2, "datachannel", (e) => {
      wrapDcSend(e.channel, e.target);
      return e;
    });
  }
  function shimConnectionState(window2) {
    if (!window2.RTCPeerConnection || "connectionState" in window2.RTCPeerConnection.prototype) {
      return;
    }
    const proto = window2.RTCPeerConnection.prototype;
    Object.defineProperty(proto, "connectionState", {
      get() {
        return {
          completed: "connected",
          checking: "connecting"
        }[this.iceConnectionState] || this.iceConnectionState;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(proto, "onconnectionstatechange", {
      get() {
        return this._onconnectionstatechange || null;
      },
      set(cb) {
        if (this._onconnectionstatechange) {
          this.removeEventListener(
            "connectionstatechange",
            this._onconnectionstatechange
          );
          delete this._onconnectionstatechange;
        }
        if (cb) {
          this.addEventListener(
            "connectionstatechange",
            this._onconnectionstatechange = cb
          );
        }
      },
      enumerable: true,
      configurable: true
    });
    ["setLocalDescription", "setRemoteDescription"].forEach((method) => {
      const origMethod = proto[method];
      proto[method] = function() {
        if (!this._connectionstatechangepoly) {
          this._connectionstatechangepoly = (e) => {
            const pc = e.target;
            if (pc._lastConnectionState !== pc.connectionState) {
              pc._lastConnectionState = pc.connectionState;
              const newEvent = new Event("connectionstatechange", e);
              pc.dispatchEvent(newEvent);
            }
            return e;
          };
          this.addEventListener(
            "iceconnectionstatechange",
            this._connectionstatechangepoly
          );
        }
        return origMethod.apply(this, arguments);
      };
    });
  }
  function removeExtmapAllowMixed(window2, browserDetails) {
    if (!window2.RTCPeerConnection) {
      return;
    }
    if (browserDetails.browser === "chrome" && browserDetails.version >= 71) {
      return;
    }
    if (browserDetails.browser === "safari" && browserDetails.version >= 605) {
      return;
    }
    const nativeSRD = window2.RTCPeerConnection.prototype.setRemoteDescription;
    window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
      if (desc && desc.sdp && desc.sdp.indexOf("\na=extmap-allow-mixed") !== -1) {
        const sdp2 = desc.sdp.split("\n").filter((line) => {
          return line.trim() !== "a=extmap-allow-mixed";
        }).join("\n");
        if (window2.RTCSessionDescription && desc instanceof window2.RTCSessionDescription) {
          arguments[0] = new window2.RTCSessionDescription({
            type: desc.type,
            sdp: sdp2
          });
        } else {
          desc.sdp = sdp2;
        }
      }
      return nativeSRD.apply(this, arguments);
    };
  }
  function shimAddIceCandidateNullOrEmpty(window2, browserDetails) {
    if (!(window2.RTCPeerConnection && window2.RTCPeerConnection.prototype)) {
      return;
    }
    const nativeAddIceCandidate = window2.RTCPeerConnection.prototype.addIceCandidate;
    if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
      return;
    }
    window2.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      if ((browserDetails.browser === "chrome" && browserDetails.version < 78 || browserDetails.browser === "firefox" && browserDetails.version < 68 || browserDetails.browser === "safari") && arguments[0] && arguments[0].candidate === "") {
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
  }
  function shimParameterlessSetLocalDescription(window2, browserDetails) {
    if (!(window2.RTCPeerConnection && window2.RTCPeerConnection.prototype)) {
      return;
    }
    const nativeSetLocalDescription = window2.RTCPeerConnection.prototype.setLocalDescription;
    if (!nativeSetLocalDescription || nativeSetLocalDescription.length === 0) {
      return;
    }
    window2.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
      let desc = arguments[0] || {};
      if (typeof desc !== "object" || desc.type && desc.sdp) {
        return nativeSetLocalDescription.apply(this, arguments);
      }
      desc = { type: desc.type, sdp: desc.sdp };
      if (!desc.type) {
        switch (this.signalingState) {
          case "stable":
          case "have-local-offer":
          case "have-remote-pranswer":
            desc.type = "offer";
            break;
          default:
            desc.type = "answer";
            break;
        }
      }
      if (desc.sdp || desc.type !== "offer" && desc.type !== "answer") {
        return nativeSetLocalDescription.apply(this, [desc]);
      }
      const func = desc.type === "offer" ? this.createOffer : this.createAnswer;
      return func.apply(this).then((d2) => nativeSetLocalDescription.apply(this, [d2]));
    };
  }

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/adapter_factory.js
  var sdp = __toESM(require_sdp());
  function adapterFactory({ window: window2 } = {}, options = {
    shimChrome: true,
    shimFirefox: true,
    shimSafari: true
  }) {
    const logging2 = log;
    const browserDetails = detectBrowser(window2);
    const adapter2 = {
      browserDetails,
      commonShim: common_shim_exports,
      extractVersion,
      disableLog,
      disableWarnings,
      // Expose sdp as a convenience. For production apps include directly.
      sdp
    };
    switch (browserDetails.browser) {
      case "chrome":
        if (!chrome_shim_exports || !shimPeerConnection || !options.shimChrome) {
          logging2("Chrome shim is not included in this adapter release.");
          return adapter2;
        }
        if (browserDetails.version === null) {
          logging2("Chrome shim can not determine version, not shimming.");
          return adapter2;
        }
        logging2("adapter.js shimming chrome.");
        adapter2.browserShim = chrome_shim_exports;
        shimAddIceCandidateNullOrEmpty(window2, browserDetails);
        shimParameterlessSetLocalDescription(window2, browserDetails);
        shimGetUserMedia(window2, browserDetails);
        shimMediaStream(window2, browserDetails);
        shimPeerConnection(window2, browserDetails);
        shimOnTrack(window2, browserDetails);
        shimAddTrackRemoveTrack(window2, browserDetails);
        shimGetSendersWithDtmf(window2, browserDetails);
        shimGetStats(window2, browserDetails);
        shimSenderReceiverGetStats(window2, browserDetails);
        fixNegotiationNeeded(window2, browserDetails);
        shimRTCIceCandidate(window2, browserDetails);
        shimRTCIceCandidateRelayProtocol(window2, browserDetails);
        shimConnectionState(window2, browserDetails);
        shimMaxMessageSize(window2, browserDetails);
        shimSendThrowTypeError(window2, browserDetails);
        removeExtmapAllowMixed(window2, browserDetails);
        break;
      case "firefox":
        if (!firefox_shim_exports || !shimPeerConnection2 || !options.shimFirefox) {
          logging2("Firefox shim is not included in this adapter release.");
          return adapter2;
        }
        logging2("adapter.js shimming firefox.");
        adapter2.browserShim = firefox_shim_exports;
        shimAddIceCandidateNullOrEmpty(window2, browserDetails);
        shimParameterlessSetLocalDescription(window2, browserDetails);
        shimGetUserMedia2(window2, browserDetails);
        shimPeerConnection2(window2, browserDetails);
        shimOnTrack2(window2, browserDetails);
        shimRemoveStream(window2, browserDetails);
        shimSenderGetStats(window2, browserDetails);
        shimReceiverGetStats(window2, browserDetails);
        shimRTCDataChannel(window2, browserDetails);
        shimAddTransceiver(window2, browserDetails);
        shimGetParameters(window2, browserDetails);
        shimCreateOffer(window2, browserDetails);
        shimCreateAnswer(window2, browserDetails);
        shimRTCIceCandidate(window2, browserDetails);
        shimConnectionState(window2, browserDetails);
        shimMaxMessageSize(window2, browserDetails);
        shimSendThrowTypeError(window2, browserDetails);
        break;
      case "safari":
        if (!safari_shim_exports || !options.shimSafari) {
          logging2("Safari shim is not included in this adapter release.");
          return adapter2;
        }
        logging2("adapter.js shimming safari.");
        adapter2.browserShim = safari_shim_exports;
        shimAddIceCandidateNullOrEmpty(window2, browserDetails);
        shimParameterlessSetLocalDescription(window2, browserDetails);
        shimRTCIceServerUrls(window2, browserDetails);
        shimCreateOfferLegacy(window2, browserDetails);
        shimCallbacksAPI(window2, browserDetails);
        shimLocalStreamsAPI(window2, browserDetails);
        shimRemoteStreamsAPI(window2, browserDetails);
        shimTrackEventTransceiver(window2, browserDetails);
        shimGetUserMedia3(window2, browserDetails);
        shimAudioContext(window2, browserDetails);
        shimRTCIceCandidate(window2, browserDetails);
        shimRTCIceCandidateRelayProtocol(window2, browserDetails);
        shimMaxMessageSize(window2, browserDetails);
        shimSendThrowTypeError(window2, browserDetails);
        removeExtmapAllowMixed(window2, browserDetails);
        break;
      default:
        logging2("Unsupported browser!");
        break;
    }
    return adapter2;
  }

  // node_modules/.pnpm/webrtc-adapter@8.2.3/node_modules/webrtc-adapter/src/js/adapter_core.js
  var adapter = adapterFactory({ window: typeof window === "undefined" ? void 0 : window });
  var adapter_core_default = adapter;

  // node_modules/.pnpm/cbor-x@1.5.4/node_modules/cbor-x/decode.js
  var decoder;
  try {
    decoder = new TextDecoder();
  } catch (error) {
  }
  var src;
  var srcEnd;
  var position = 0;
  var EMPTY_ARRAY = [];
  var LEGACY_RECORD_INLINE_ID = 105;
  var RECORD_DEFINITIONS_ID = 57342;
  var RECORD_INLINE_ID = 57343;
  var BUNDLED_STRINGS_ID = 57337;
  var PACKED_REFERENCE_TAG_ID = 6;
  var STOP_CODE = {};
  var strings = EMPTY_ARRAY;
  var stringPosition = 0;
  var currentDecoder = {};
  var currentStructures;
  var srcString;
  var srcStringStart = 0;
  var srcStringEnd = 0;
  var bundledStrings;
  var referenceMap;
  var currentExtensions = [];
  var currentExtensionRanges = [];
  var packedValues;
  var dataView;
  var restoreMapsAsObject;
  var defaultOptions = {
    useRecords: false,
    mapsAsObjects: true
  };
  var sequentialMode = false;
  var inlineObjectReadThreshold = 2;
  try {
    new Function("");
  } catch (error) {
    inlineObjectReadThreshold = Infinity;
  }
  var Decoder = class {
    constructor(options) {
      if (options) {
        if ((options.keyMap || options._keyMap) && !options.useRecords) {
          options.useRecords = false;
          options.mapsAsObjects = true;
        }
        if (options.useRecords === false && options.mapsAsObjects === void 0)
          options.mapsAsObjects = true;
        if (options.getStructures)
          options.getShared = options.getStructures;
        if (options.getShared && !options.structures)
          (options.structures = []).uninitialized = true;
        if (options.keyMap) {
          this.mapKey = /* @__PURE__ */ new Map();
          for (let [k2, v2] of Object.entries(options.keyMap))
            this.mapKey.set(v2, k2);
        }
      }
      Object.assign(this, options);
    }
    /*
    decodeKey(key) {
    	return this.keyMap
    		? Object.keys(this.keyMap)[Object.values(this.keyMap).indexOf(key)] || key
    		: key
    }
    */
    decodeKey(key) {
      return this.keyMap ? this.mapKey.get(key) || key : key;
    }
    encodeKey(key) {
      return this.keyMap && this.keyMap.hasOwnProperty(key) ? this.keyMap[key] : key;
    }
    encodeKeys(rec) {
      if (!this._keyMap)
        return rec;
      let map = /* @__PURE__ */ new Map();
      for (let [k2, v2] of Object.entries(rec))
        map.set(this._keyMap.hasOwnProperty(k2) ? this._keyMap[k2] : k2, v2);
      return map;
    }
    decodeKeys(map) {
      if (!this._keyMap || map.constructor.name != "Map")
        return map;
      if (!this._mapKey) {
        this._mapKey = /* @__PURE__ */ new Map();
        for (let [k2, v2] of Object.entries(this._keyMap))
          this._mapKey.set(v2, k2);
      }
      let res = {};
      map.forEach((v2, k2) => res[safeKey(this._mapKey.has(k2) ? this._mapKey.get(k2) : k2)] = v2);
      return res;
    }
    mapDecode(source, end) {
      let res = this.decode(source);
      if (this._keyMap) {
        switch (res.constructor.name) {
          case "Array":
            return res.map((r) => this.decodeKeys(r));
        }
      }
      return res;
    }
    decode(source, end) {
      if (src) {
        return saveState(() => {
          clearSource();
          return this ? this.decode(source, end) : Decoder.prototype.decode.call(defaultOptions, source, end);
        });
      }
      srcEnd = end > -1 ? end : source.length;
      position = 0;
      stringPosition = 0;
      srcStringEnd = 0;
      srcString = null;
      strings = EMPTY_ARRAY;
      bundledStrings = null;
      src = source;
      try {
        dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
      } catch (error) {
        src = null;
        if (source instanceof Uint8Array)
          throw error;
        throw new Error("Source must be a Uint8Array or Buffer but was a " + (source && typeof source == "object" ? source.constructor.name : typeof source));
      }
      if (this instanceof Decoder) {
        currentDecoder = this;
        packedValues = this.sharedValues && (this.pack ? new Array(this.maxPrivatePackedValues || 16).concat(this.sharedValues) : this.sharedValues);
        if (this.structures) {
          currentStructures = this.structures;
          return checkedRead();
        } else if (!currentStructures || currentStructures.length > 0) {
          currentStructures = [];
        }
      } else {
        currentDecoder = defaultOptions;
        if (!currentStructures || currentStructures.length > 0)
          currentStructures = [];
        packedValues = null;
      }
      return checkedRead();
    }
    decodeMultiple(source, forEach) {
      let values, lastPosition = 0;
      try {
        let size = source.length;
        sequentialMode = true;
        let value = this ? this.decode(source, size) : defaultDecoder.decode(source, size);
        if (forEach) {
          if (forEach(value) === false) {
            return;
          }
          while (position < size) {
            lastPosition = position;
            if (forEach(checkedRead()) === false) {
              return;
            }
          }
        } else {
          values = [value];
          while (position < size) {
            lastPosition = position;
            values.push(checkedRead());
          }
          return values;
        }
      } catch (error) {
        error.lastPosition = lastPosition;
        error.values = values;
        throw error;
      } finally {
        sequentialMode = false;
        clearSource();
      }
    }
  };
  function checkedRead() {
    try {
      let result = read();
      if (bundledStrings) {
        if (position >= bundledStrings.postBundlePosition) {
          let error = new Error("Unexpected bundle position");
          error.incomplete = true;
          throw error;
        }
        position = bundledStrings.postBundlePosition;
        bundledStrings = null;
      }
      if (position == srcEnd) {
        currentStructures = null;
        src = null;
        if (referenceMap)
          referenceMap = null;
      } else if (position > srcEnd) {
        let error = new Error("Unexpected end of CBOR data");
        error.incomplete = true;
        throw error;
      } else if (!sequentialMode) {
        throw new Error("Data read, but end of buffer not reached");
      }
      return result;
    } catch (error) {
      clearSource();
      if (error instanceof RangeError || error.message.startsWith("Unexpected end of buffer")) {
        error.incomplete = true;
      }
      throw error;
    }
  }
  function read() {
    let token = src[position++];
    let majorType = token >> 5;
    token = token & 31;
    if (token > 23) {
      switch (token) {
        case 24:
          token = src[position++];
          break;
        case 25:
          if (majorType == 7) {
            return getFloat16();
          }
          token = dataView.getUint16(position);
          position += 2;
          break;
        case 26:
          if (majorType == 7) {
            let value = dataView.getFloat32(position);
            if (currentDecoder.useFloat32 > 2) {
              let multiplier = mult10[(src[position] & 127) << 1 | src[position + 1] >> 7];
              position += 4;
              return (multiplier * value + (value > 0 ? 0.5 : -0.5) >> 0) / multiplier;
            }
            position += 4;
            return value;
          }
          token = dataView.getUint32(position);
          position += 4;
          break;
        case 27:
          if (majorType == 7) {
            let value = dataView.getFloat64(position);
            position += 8;
            return value;
          }
          if (majorType > 1) {
            if (dataView.getUint32(position) > 0)
              throw new Error("JavaScript does not support arrays, maps, or strings with length over 4294967295");
            token = dataView.getUint32(position + 4);
          } else if (currentDecoder.int64AsNumber) {
            token = dataView.getUint32(position) * 4294967296;
            token += dataView.getUint32(position + 4);
          } else
            token = dataView.getBigUint64(position);
          position += 8;
          break;
        case 31:
          switch (majorType) {
            case 2:
            case 3:
              throw new Error("Indefinite length not supported for byte or text strings");
            case 4:
              let array = [];
              let value, i = 0;
              while ((value = read()) != STOP_CODE) {
                array[i++] = value;
              }
              return majorType == 4 ? array : majorType == 3 ? array.join("") : Buffer.concat(array);
            case 5:
              let key;
              if (currentDecoder.mapsAsObjects) {
                let object = {};
                if (currentDecoder.keyMap)
                  while ((key = read()) != STOP_CODE)
                    object[safeKey(currentDecoder.decodeKey(key))] = read();
                else
                  while ((key = read()) != STOP_CODE)
                    object[safeKey(key)] = read();
                return object;
              } else {
                if (restoreMapsAsObject) {
                  currentDecoder.mapsAsObjects = true;
                  restoreMapsAsObject = false;
                }
                let map = /* @__PURE__ */ new Map();
                if (currentDecoder.keyMap)
                  while ((key = read()) != STOP_CODE)
                    map.set(currentDecoder.decodeKey(key), read());
                else
                  while ((key = read()) != STOP_CODE)
                    map.set(key, read());
                return map;
              }
            case 7:
              return STOP_CODE;
            default:
              throw new Error("Invalid major type for indefinite length " + majorType);
          }
        default:
          throw new Error("Unknown token " + token);
      }
    }
    switch (majorType) {
      case 0:
        return token;
      case 1:
        return ~token;
      case 2:
        return readBin(token);
      case 3:
        if (srcStringEnd >= position) {
          return srcString.slice(position - srcStringStart, (position += token) - srcStringStart);
        }
        if (srcStringEnd == 0 && srcEnd < 140 && token < 32) {
          let string = token < 16 ? shortStringInJS(token) : longStringInJS(token);
          if (string != null)
            return string;
        }
        return readFixedString(token);
      case 4:
        let array = new Array(token);
        for (let i = 0; i < token; i++)
          array[i] = read();
        return array;
      case 5:
        if (currentDecoder.mapsAsObjects) {
          let object = {};
          if (currentDecoder.keyMap)
            for (let i = 0; i < token; i++)
              object[safeKey(currentDecoder.decodeKey(read()))] = read();
          else
            for (let i = 0; i < token; i++)
              object[safeKey(read())] = read();
          return object;
        } else {
          if (restoreMapsAsObject) {
            currentDecoder.mapsAsObjects = true;
            restoreMapsAsObject = false;
          }
          let map = /* @__PURE__ */ new Map();
          if (currentDecoder.keyMap)
            for (let i = 0; i < token; i++)
              map.set(currentDecoder.decodeKey(read()), read());
          else
            for (let i = 0; i < token; i++)
              map.set(read(), read());
          return map;
        }
      case 6:
        if (token >= BUNDLED_STRINGS_ID) {
          let structure = currentStructures[token & 8191];
          if (structure) {
            if (!structure.read)
              structure.read = createStructureReader(structure);
            return structure.read();
          }
          if (token < 65536) {
            if (token == RECORD_INLINE_ID) {
              let length = readJustLength();
              let id = read();
              let structure2 = read();
              recordDefinition(id, structure2);
              let object = {};
              if (currentDecoder.keyMap)
                for (let i = 2; i < length; i++) {
                  let key = currentDecoder.decodeKey(structure2[i - 2]);
                  object[safeKey(key)] = read();
                }
              else
                for (let i = 2; i < length; i++) {
                  let key = structure2[i - 2];
                  object[safeKey(key)] = read();
                }
              return object;
            } else if (token == RECORD_DEFINITIONS_ID) {
              let length = readJustLength();
              let id = read();
              for (let i = 2; i < length; i++) {
                recordDefinition(id++, read());
              }
              return read();
            } else if (token == BUNDLED_STRINGS_ID) {
              return readBundleExt();
            }
            if (currentDecoder.getShared) {
              loadShared();
              structure = currentStructures[token & 8191];
              if (structure) {
                if (!structure.read)
                  structure.read = createStructureReader(structure);
                return structure.read();
              }
            }
          }
        }
        let extension = currentExtensions[token];
        if (extension) {
          if (extension.handlesRead)
            return extension(read);
          else
            return extension(read());
        } else {
          let input = read();
          for (let i = 0; i < currentExtensionRanges.length; i++) {
            let value = currentExtensionRanges[i](token, input);
            if (value !== void 0)
              return value;
          }
          return new Tag(input, token);
        }
      case 7:
        switch (token) {
          case 20:
            return false;
          case 21:
            return true;
          case 22:
            return null;
          case 23:
            return;
          case 31:
          default:
            let packedValue = (packedValues || getPackedValues())[token];
            if (packedValue !== void 0)
              return packedValue;
            throw new Error("Unknown token " + token);
        }
      default:
        if (isNaN(token)) {
          let error = new Error("Unexpected end of CBOR data");
          error.incomplete = true;
          throw error;
        }
        throw new Error("Unknown CBOR token " + token);
    }
  }
  var validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
  function createStructureReader(structure) {
    function readObject() {
      let length = src[position++];
      length = length & 31;
      if (length > 23) {
        switch (length) {
          case 24:
            length = src[position++];
            break;
          case 25:
            length = dataView.getUint16(position);
            position += 2;
            break;
          case 26:
            length = dataView.getUint32(position);
            position += 4;
            break;
          default:
            throw new Error("Expected array header, but got " + src[position - 1]);
        }
      }
      let compiledReader = this.compiledReader;
      while (compiledReader) {
        if (compiledReader.propertyCount === length)
          return compiledReader(read);
        compiledReader = compiledReader.next;
      }
      if (this.slowReads++ >= inlineObjectReadThreshold) {
        let array = this.length == length ? this : this.slice(0, length);
        compiledReader = currentDecoder.keyMap ? new Function("r", "return {" + array.map((k2) => currentDecoder.decodeKey(k2)).map((k2) => validName.test(k2) ? safeKey(k2) + ":r()" : "[" + JSON.stringify(k2) + "]:r()").join(",") + "}") : new Function("r", "return {" + array.map((key) => validName.test(key) ? safeKey(key) + ":r()" : "[" + JSON.stringify(key) + "]:r()").join(",") + "}");
        if (this.compiledReader)
          compiledReader.next = this.compiledReader;
        compiledReader.propertyCount = length;
        this.compiledReader = compiledReader;
        return compiledReader(read);
      }
      let object = {};
      if (currentDecoder.keyMap)
        for (let i = 0; i < length; i++)
          object[safeKey(currentDecoder.decodeKey(this[i]))] = read();
      else
        for (let i = 0; i < length; i++) {
          object[safeKey(this[i])] = read();
        }
      return object;
    }
    structure.slowReads = 0;
    return readObject;
  }
  function safeKey(key) {
    return key === "__proto__" ? "__proto_" : key;
  }
  var readFixedString = readStringJS;
  function readStringJS(length) {
    let result;
    if (length < 16) {
      if (result = shortStringInJS(length))
        return result;
    }
    if (length > 64 && decoder)
      return decoder.decode(src.subarray(position, position += length));
    const end = position + length;
    const units = [];
    result = "";
    while (position < end) {
      const byte1 = src[position++];
      if ((byte1 & 128) === 0) {
        units.push(byte1);
      } else if ((byte1 & 224) === 192) {
        const byte2 = src[position++] & 63;
        units.push((byte1 & 31) << 6 | byte2);
      } else if ((byte1 & 240) === 224) {
        const byte2 = src[position++] & 63;
        const byte3 = src[position++] & 63;
        units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
      } else if ((byte1 & 248) === 240) {
        const byte2 = src[position++] & 63;
        const byte3 = src[position++] & 63;
        const byte4 = src[position++] & 63;
        let unit2 = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
        if (unit2 > 65535) {
          unit2 -= 65536;
          units.push(unit2 >>> 10 & 1023 | 55296);
          unit2 = 56320 | unit2 & 1023;
        }
        units.push(unit2);
      } else {
        units.push(byte1);
      }
      if (units.length >= 4096) {
        result += fromCharCode.apply(String, units);
        units.length = 0;
      }
    }
    if (units.length > 0) {
      result += fromCharCode.apply(String, units);
    }
    return result;
  }
  var fromCharCode = String.fromCharCode;
  function longStringInJS(length) {
    let start = position;
    let bytes = new Array(length);
    for (let i = 0; i < length; i++) {
      const byte = src[position++];
      if ((byte & 128) > 0) {
        position = start;
        return;
      }
      bytes[i] = byte;
    }
    return fromCharCode.apply(String, bytes);
  }
  function shortStringInJS(length) {
    if (length < 4) {
      if (length < 2) {
        if (length === 0)
          return "";
        else {
          let a = src[position++];
          if ((a & 128) > 1) {
            position -= 1;
            return;
          }
          return fromCharCode(a);
        }
      } else {
        let a = src[position++];
        let b2 = src[position++];
        if ((a & 128) > 0 || (b2 & 128) > 0) {
          position -= 2;
          return;
        }
        if (length < 3)
          return fromCharCode(a, b2);
        let c2 = src[position++];
        if ((c2 & 128) > 0) {
          position -= 3;
          return;
        }
        return fromCharCode(a, b2, c2);
      }
    } else {
      let a = src[position++];
      let b2 = src[position++];
      let c2 = src[position++];
      let d2 = src[position++];
      if ((a & 128) > 0 || (b2 & 128) > 0 || (c2 & 128) > 0 || (d2 & 128) > 0) {
        position -= 4;
        return;
      }
      if (length < 6) {
        if (length === 4)
          return fromCharCode(a, b2, c2, d2);
        else {
          let e = src[position++];
          if ((e & 128) > 0) {
            position -= 5;
            return;
          }
          return fromCharCode(a, b2, c2, d2, e);
        }
      } else if (length < 8) {
        let e = src[position++];
        let f2 = src[position++];
        if ((e & 128) > 0 || (f2 & 128) > 0) {
          position -= 6;
          return;
        }
        if (length < 7)
          return fromCharCode(a, b2, c2, d2, e, f2);
        let g2 = src[position++];
        if ((g2 & 128) > 0) {
          position -= 7;
          return;
        }
        return fromCharCode(a, b2, c2, d2, e, f2, g2);
      } else {
        let e = src[position++];
        let f2 = src[position++];
        let g2 = src[position++];
        let h2 = src[position++];
        if ((e & 128) > 0 || (f2 & 128) > 0 || (g2 & 128) > 0 || (h2 & 128) > 0) {
          position -= 8;
          return;
        }
        if (length < 10) {
          if (length === 8)
            return fromCharCode(a, b2, c2, d2, e, f2, g2, h2);
          else {
            let i = src[position++];
            if ((i & 128) > 0) {
              position -= 9;
              return;
            }
            return fromCharCode(a, b2, c2, d2, e, f2, g2, h2, i);
          }
        } else if (length < 12) {
          let i = src[position++];
          let j2 = src[position++];
          if ((i & 128) > 0 || (j2 & 128) > 0) {
            position -= 10;
            return;
          }
          if (length < 11)
            return fromCharCode(a, b2, c2, d2, e, f2, g2, h2, i, j2);
          let k2 = src[position++];
          if ((k2 & 128) > 0) {
            position -= 11;
            return;
          }
          return fromCharCode(a, b2, c2, d2, e, f2, g2, h2, i, j2, k2);
        } else {
          let i = src[position++];
          let j2 = src[position++];
          let k2 = src[position++];
          let l2 = src[position++];
          if ((i & 128) > 0 || (j2 & 128) > 0 || (k2 & 128) > 0 || (l2 & 128) > 0) {
            position -= 12;
            return;
          }
          if (length < 14) {
            if (length === 12)
              return fromCharCode(a, b2, c2, d2, e, f2, g2, h2, i, j2, k2, l2);
            else {
              let m2 = src[position++];
              if ((m2 & 128) > 0) {
                position -= 13;
                return;
              }
              return fromCharCode(a, b2, c2, d2, e, f2, g2, h2, i, j2, k2, l2, m2);
            }
          } else {
            let m2 = src[position++];
            let n = src[position++];
            if ((m2 & 128) > 0 || (n & 128) > 0) {
              position -= 14;
              return;
            }
            if (length < 15)
              return fromCharCode(a, b2, c2, d2, e, f2, g2, h2, i, j2, k2, l2, m2, n);
            let o = src[position++];
            if ((o & 128) > 0) {
              position -= 15;
              return;
            }
            return fromCharCode(a, b2, c2, d2, e, f2, g2, h2, i, j2, k2, l2, m2, n, o);
          }
        }
      }
    }
  }
  function readBin(length) {
    return currentDecoder.copyBuffers ? (
      // specifically use the copying slice (not the node one)
      Uint8Array.prototype.slice.call(src, position, position += length)
    ) : src.subarray(position, position += length);
  }
  var f32Array = new Float32Array(1);
  var u8Array = new Uint8Array(f32Array.buffer, 0, 4);
  function getFloat16() {
    let byte0 = src[position++];
    let byte1 = src[position++];
    let exponent = (byte0 & 127) >> 2;
    if (exponent === 31) {
      if (byte1 || byte0 & 3)
        return NaN;
      return byte0 & 128 ? -Infinity : Infinity;
    }
    if (exponent === 0) {
      let abs = ((byte0 & 3) << 8 | byte1) / (1 << 24);
      return byte0 & 128 ? -abs : abs;
    }
    u8Array[3] = byte0 & 128 | // sign bit
    (exponent >> 1) + 56;
    u8Array[2] = (byte0 & 7) << 5 | // last exponent bit and first two mantissa bits
    byte1 >> 3;
    u8Array[1] = byte1 << 5;
    u8Array[0] = 0;
    return f32Array[0];
  }
  var keyCache = new Array(4096);
  var Tag = class {
    constructor(value, tag) {
      this.value = value;
      this.tag = tag;
    }
  };
  currentExtensions[0] = (dateString) => {
    return new Date(dateString);
  };
  currentExtensions[1] = (epochSec) => {
    return new Date(Math.round(epochSec * 1e3));
  };
  currentExtensions[2] = (buffer) => {
    let value = BigInt(0);
    for (let i = 0, l2 = buffer.byteLength; i < l2; i++) {
      value = BigInt(buffer[i]) + value << BigInt(8);
    }
    return value;
  };
  currentExtensions[3] = (buffer) => {
    return BigInt(-1) - currentExtensions[2](buffer);
  };
  currentExtensions[4] = (fraction) => {
    return +(fraction[1] + "e" + fraction[0]);
  };
  currentExtensions[5] = (fraction) => {
    return fraction[1] * Math.exp(fraction[0] * Math.log(2));
  };
  var recordDefinition = (id, structure) => {
    id = id - 57344;
    let existingStructure = currentStructures[id];
    if (existingStructure && existingStructure.isShared) {
      (currentStructures.restoreStructures || (currentStructures.restoreStructures = []))[id] = existingStructure;
    }
    currentStructures[id] = structure;
    structure.read = createStructureReader(structure);
  };
  currentExtensions[LEGACY_RECORD_INLINE_ID] = (data) => {
    let length = data.length;
    let structure = data[1];
    recordDefinition(data[0], structure);
    let object = {};
    for (let i = 2; i < length; i++) {
      let key = structure[i - 2];
      object[safeKey(key)] = data[i];
    }
    return object;
  };
  currentExtensions[14] = (value) => {
    if (bundledStrings)
      return bundledStrings[0].slice(bundledStrings.position0, bundledStrings.position0 += value);
    return new Tag(value, 14);
  };
  currentExtensions[15] = (value) => {
    if (bundledStrings)
      return bundledStrings[1].slice(bundledStrings.position1, bundledStrings.position1 += value);
    return new Tag(value, 15);
  };
  var glbl = { Error, RegExp };
  currentExtensions[27] = (data) => {
    return (glbl[data[0]] || Error)(data[1], data[2]);
  };
  var packedTable = (read2) => {
    if (src[position++] != 132)
      throw new Error("Packed values structure must be followed by a 4 element array");
    let newPackedValues = read2();
    packedValues = packedValues ? newPackedValues.concat(packedValues.slice(newPackedValues.length)) : newPackedValues;
    packedValues.prefixes = read2();
    packedValues.suffixes = read2();
    return read2();
  };
  packedTable.handlesRead = true;
  currentExtensions[51] = packedTable;
  currentExtensions[PACKED_REFERENCE_TAG_ID] = (data) => {
    if (!packedValues) {
      if (currentDecoder.getShared)
        loadShared();
      else
        return new Tag(data, PACKED_REFERENCE_TAG_ID);
    }
    if (typeof data == "number")
      return packedValues[16 + (data >= 0 ? 2 * data : -2 * data - 1)];
    throw new Error("No support for non-integer packed references yet");
  };
  currentExtensions[28] = (read2) => {
    if (!referenceMap) {
      referenceMap = /* @__PURE__ */ new Map();
      referenceMap.id = 0;
    }
    let id = referenceMap.id++;
    let token = src[position];
    let target2;
    if (token >> 5 == 4)
      target2 = [];
    else
      target2 = {};
    let refEntry = { target: target2 };
    referenceMap.set(id, refEntry);
    let targetProperties = read2();
    if (refEntry.used)
      return Object.assign(target2, targetProperties);
    refEntry.target = targetProperties;
    return targetProperties;
  };
  currentExtensions[28].handlesRead = true;
  currentExtensions[29] = (id) => {
    let refEntry = referenceMap.get(id);
    refEntry.used = true;
    return refEntry.target;
  };
  currentExtensions[258] = (array) => new Set(array);
  (currentExtensions[259] = (read2) => {
    if (currentDecoder.mapsAsObjects) {
      currentDecoder.mapsAsObjects = false;
      restoreMapsAsObject = true;
    }
    return read2();
  }).handlesRead = true;
  function combine(a, b2) {
    if (typeof a === "string")
      return a + b2;
    if (a instanceof Array)
      return a.concat(b2);
    return Object.assign({}, a, b2);
  }
  function getPackedValues() {
    if (!packedValues) {
      if (currentDecoder.getShared)
        loadShared();
      else
        throw new Error("No packed values available");
    }
    return packedValues;
  }
  var SHARED_DATA_TAG_ID = 1399353956;
  currentExtensionRanges.push((tag, input) => {
    if (tag >= 225 && tag <= 255)
      return combine(getPackedValues().prefixes[tag - 224], input);
    if (tag >= 28704 && tag <= 32767)
      return combine(getPackedValues().prefixes[tag - 28672], input);
    if (tag >= 1879052288 && tag <= 2147483647)
      return combine(getPackedValues().prefixes[tag - 1879048192], input);
    if (tag >= 216 && tag <= 223)
      return combine(input, getPackedValues().suffixes[tag - 216]);
    if (tag >= 27647 && tag <= 28671)
      return combine(input, getPackedValues().suffixes[tag - 27639]);
    if (tag >= 1811940352 && tag <= 1879048191)
      return combine(input, getPackedValues().suffixes[tag - 1811939328]);
    if (tag == SHARED_DATA_TAG_ID) {
      return {
        packedValues,
        structures: currentStructures.slice(0),
        version: input
      };
    }
    if (tag == 55799)
      return input;
  });
  var isLittleEndianMachine = new Uint8Array(new Uint16Array([1]).buffer)[0] == 1;
  var typedArrays = [
    Uint8Array,
    Uint8ClampedArray,
    Uint16Array,
    Uint32Array,
    typeof BigUint64Array == "undefined" ? { name: "BigUint64Array" } : BigUint64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    typeof BigInt64Array == "undefined" ? { name: "BigInt64Array" } : BigInt64Array,
    Float32Array,
    Float64Array
  ];
  var typedArrayTags = [64, 68, 69, 70, 71, 72, 77, 78, 79, 85, 86];
  for (let i = 0; i < typedArrays.length; i++) {
    registerTypedArray(typedArrays[i], typedArrayTags[i]);
  }
  function registerTypedArray(TypedArray, tag) {
    let dvMethod = "get" + TypedArray.name.slice(0, -5);
    let bytesPerElement;
    if (typeof TypedArray === "function")
      bytesPerElement = TypedArray.BYTES_PER_ELEMENT;
    else
      TypedArray = null;
    for (let littleEndian = 0; littleEndian < 2; littleEndian++) {
      if (!littleEndian && bytesPerElement == 1)
        continue;
      let sizeShift = bytesPerElement == 2 ? 1 : bytesPerElement == 4 ? 2 : 3;
      currentExtensions[littleEndian ? tag : tag - 4] = bytesPerElement == 1 || littleEndian == isLittleEndianMachine ? (buffer) => {
        if (!TypedArray)
          throw new Error("Could not find typed array for code " + tag);
        return new TypedArray(Uint8Array.prototype.slice.call(buffer, 0).buffer);
      } : (buffer) => {
        if (!TypedArray)
          throw new Error("Could not find typed array for code " + tag);
        let dv = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        let elements = buffer.length >> sizeShift;
        let ta = new TypedArray(elements);
        let method = dv[dvMethod];
        for (let i = 0; i < elements; i++) {
          ta[i] = method.call(dv, i << sizeShift, littleEndian);
        }
        return ta;
      };
    }
  }
  function readBundleExt() {
    let length = readJustLength();
    let bundlePosition = position + read();
    for (let i = 2; i < length; i++) {
      let bundleLength = readJustLength();
      position += bundleLength;
    }
    let dataPosition = position;
    position = bundlePosition;
    bundledStrings = [readStringJS(readJustLength()), readStringJS(readJustLength())];
    bundledStrings.position0 = 0;
    bundledStrings.position1 = 0;
    bundledStrings.postBundlePosition = position;
    position = dataPosition;
    return read();
  }
  function readJustLength() {
    let token = src[position++] & 31;
    if (token > 23) {
      switch (token) {
        case 24:
          token = src[position++];
          break;
        case 25:
          token = dataView.getUint16(position);
          position += 2;
          break;
        case 26:
          token = dataView.getUint32(position);
          position += 4;
          break;
      }
    }
    return token;
  }
  function loadShared() {
    if (currentDecoder.getShared) {
      let sharedData = saveState(() => {
        src = null;
        return currentDecoder.getShared();
      }) || {};
      let updatedStructures = sharedData.structures || [];
      currentDecoder.sharedVersion = sharedData.version;
      packedValues = currentDecoder.sharedValues = sharedData.packedValues;
      if (currentStructures === true)
        currentDecoder.structures = currentStructures = updatedStructures;
      else
        currentStructures.splice.apply(currentStructures, [0, updatedStructures.length].concat(updatedStructures));
    }
  }
  function saveState(callback) {
    let savedSrcEnd = srcEnd;
    let savedPosition = position;
    let savedStringPosition = stringPosition;
    let savedSrcStringStart = srcStringStart;
    let savedSrcStringEnd = srcStringEnd;
    let savedSrcString = srcString;
    let savedStrings = strings;
    let savedReferenceMap = referenceMap;
    let savedBundledStrings = bundledStrings;
    let savedSrc = new Uint8Array(src.slice(0, srcEnd));
    let savedStructures = currentStructures;
    let savedDecoder = currentDecoder;
    let savedSequentialMode = sequentialMode;
    let value = callback();
    srcEnd = savedSrcEnd;
    position = savedPosition;
    stringPosition = savedStringPosition;
    srcStringStart = savedSrcStringStart;
    srcStringEnd = savedSrcStringEnd;
    srcString = savedSrcString;
    strings = savedStrings;
    referenceMap = savedReferenceMap;
    bundledStrings = savedBundledStrings;
    src = savedSrc;
    sequentialMode = savedSequentialMode;
    currentStructures = savedStructures;
    currentDecoder = savedDecoder;
    dataView = new DataView(src.buffer, src.byteOffset, src.byteLength);
    return value;
  }
  function clearSource() {
    src = null;
    referenceMap = null;
    currentStructures = null;
  }
  var mult10 = new Array(147);
  for (let i = 0; i < 256; i++) {
    mult10[i] = +("1e" + Math.floor(45.15 - i * 0.30103));
  }
  var defaultDecoder = new Decoder({ useRecords: false });
  var decode = defaultDecoder.decode;
  var decodeMultiple = defaultDecoder.decodeMultiple;
  var FLOAT32_OPTIONS = {
    NEVER: 0,
    ALWAYS: 1,
    DECIMAL_ROUND: 3,
    DECIMAL_FIT: 4
  };

  // node_modules/.pnpm/cbor-x@1.5.4/node_modules/cbor-x/encode.js
  var textEncoder;
  try {
    textEncoder = new TextEncoder();
  } catch (error) {
  }
  var extensions;
  var extensionClasses;
  var Buffer2 = typeof globalThis === "object" && globalThis.Buffer;
  var hasNodeBuffer = typeof Buffer2 !== "undefined";
  var ByteArrayAllocate = hasNodeBuffer ? Buffer2.allocUnsafeSlow : Uint8Array;
  var ByteArray = hasNodeBuffer ? Buffer2 : Uint8Array;
  var MAX_STRUCTURES = 256;
  var MAX_BUFFER_SIZE = hasNodeBuffer ? 4294967296 : 2144337920;
  var throwOnIterable;
  var target;
  var targetView;
  var position2 = 0;
  var safeEnd;
  var bundledStrings2 = null;
  var MAX_BUNDLE_SIZE = 61440;
  var hasNonLatin = /[\u0080-\uFFFF]/;
  var RECORD_SYMBOL = Symbol("record-id");
  var Encoder = class extends Decoder {
    constructor(options) {
      super(options);
      this.offset = 0;
      let typeBuffer;
      let start;
      let sharedStructures;
      let hasSharedUpdate;
      let structures;
      let referenceMap2;
      options = options || {};
      let encodeUtf8 = ByteArray.prototype.utf8Write ? function(string, position3, maxBytes) {
        return target.utf8Write(string, position3, maxBytes);
      } : textEncoder && textEncoder.encodeInto ? function(string, position3) {
        return textEncoder.encodeInto(string, target.subarray(position3)).written;
      } : false;
      let encoder = this;
      let hasSharedStructures = options.structures || options.saveStructures;
      let maxSharedStructures = options.maxSharedStructures;
      if (maxSharedStructures == null)
        maxSharedStructures = hasSharedStructures ? 128 : 0;
      if (maxSharedStructures > 8190)
        throw new Error("Maximum maxSharedStructure is 8190");
      let isSequential = options.sequential;
      if (isSequential) {
        maxSharedStructures = 0;
      }
      if (!this.structures)
        this.structures = [];
      if (this.saveStructures)
        this.saveShared = this.saveStructures;
      let samplingPackedValues, packedObjectMap2, sharedValues = options.sharedValues;
      let sharedPackedObjectMap2;
      if (sharedValues) {
        sharedPackedObjectMap2 = /* @__PURE__ */ Object.create(null);
        for (let i = 0, l2 = sharedValues.length; i < l2; i++) {
          sharedPackedObjectMap2[sharedValues[i]] = i;
        }
      }
      let recordIdsToRemove = [];
      let transitionsCount = 0;
      let serializationsSinceTransitionRebuild = 0;
      this.mapEncode = function(value, encodeOptions) {
        if (this._keyMap && !this._mapped) {
          switch (value.constructor.name) {
            case "Array":
              value = value.map((r) => this.encodeKeys(r));
              break;
          }
        }
        return this.encode(value, encodeOptions);
      };
      this.encode = function(value, encodeOptions) {
        if (!target) {
          target = new ByteArrayAllocate(8192);
          targetView = new DataView(target.buffer, 0, 8192);
          position2 = 0;
        }
        safeEnd = target.length - 10;
        if (safeEnd - position2 < 2048) {
          target = new ByteArrayAllocate(target.length);
          targetView = new DataView(target.buffer, 0, target.length);
          safeEnd = target.length - 10;
          position2 = 0;
        } else if (encodeOptions === REUSE_BUFFER_MODE)
          position2 = position2 + 7 & 2147483640;
        start = position2;
        if (encoder.useSelfDescribedHeader) {
          targetView.setUint32(position2, 3654940416);
          position2 += 3;
        }
        referenceMap2 = encoder.structuredClone ? /* @__PURE__ */ new Map() : null;
        if (encoder.bundleStrings && typeof value !== "string") {
          bundledStrings2 = [];
          bundledStrings2.size = Infinity;
        } else
          bundledStrings2 = null;
        sharedStructures = encoder.structures;
        if (sharedStructures) {
          if (sharedStructures.uninitialized) {
            let sharedData = encoder.getShared() || {};
            encoder.structures = sharedStructures = sharedData.structures || [];
            encoder.sharedVersion = sharedData.version;
            let sharedValues2 = encoder.sharedValues = sharedData.packedValues;
            if (sharedValues2) {
              sharedPackedObjectMap2 = {};
              for (let i = 0, l2 = sharedValues2.length; i < l2; i++)
                sharedPackedObjectMap2[sharedValues2[i]] = i;
            }
          }
          let sharedStructuresLength = sharedStructures.length;
          if (sharedStructuresLength > maxSharedStructures && !isSequential)
            sharedStructuresLength = maxSharedStructures;
          if (!sharedStructures.transitions) {
            sharedStructures.transitions = /* @__PURE__ */ Object.create(null);
            for (let i = 0; i < sharedStructuresLength; i++) {
              let keys = sharedStructures[i];
              if (!keys)
                continue;
              let nextTransition, transition = sharedStructures.transitions;
              for (let j2 = 0, l2 = keys.length; j2 < l2; j2++) {
                if (transition[RECORD_SYMBOL] === void 0)
                  transition[RECORD_SYMBOL] = i;
                let key = keys[j2];
                nextTransition = transition[key];
                if (!nextTransition) {
                  nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
                }
                transition = nextTransition;
              }
              transition[RECORD_SYMBOL] = i | 1048576;
            }
          }
          if (!isSequential)
            sharedStructures.nextId = sharedStructuresLength;
        }
        if (hasSharedUpdate)
          hasSharedUpdate = false;
        structures = sharedStructures || [];
        packedObjectMap2 = sharedPackedObjectMap2;
        if (options.pack) {
          let packedValues2 = /* @__PURE__ */ new Map();
          packedValues2.values = [];
          packedValues2.encoder = encoder;
          packedValues2.maxValues = options.maxPrivatePackedValues || (sharedPackedObjectMap2 ? 16 : Infinity);
          packedValues2.objectMap = sharedPackedObjectMap2 || false;
          packedValues2.samplingPackedValues = samplingPackedValues;
          findRepetitiveStrings(value, packedValues2);
          if (packedValues2.values.length > 0) {
            target[position2++] = 216;
            target[position2++] = 51;
            writeArrayHeader(4);
            let valuesArray = packedValues2.values;
            encode2(valuesArray);
            writeArrayHeader(0);
            writeArrayHeader(0);
            packedObjectMap2 = Object.create(sharedPackedObjectMap2 || null);
            for (let i = 0, l2 = valuesArray.length; i < l2; i++) {
              packedObjectMap2[valuesArray[i]] = i;
            }
          }
        }
        throwOnIterable = encodeOptions & THROW_ON_ITERABLE;
        try {
          if (throwOnIterable)
            return;
          encode2(value);
          if (bundledStrings2) {
            writeBundles(start, encode2);
          }
          encoder.offset = position2;
          if (referenceMap2 && referenceMap2.idsToInsert) {
            position2 += referenceMap2.idsToInsert.length * 2;
            if (position2 > safeEnd)
              makeRoom(position2);
            encoder.offset = position2;
            let serialized = insertIds(target.subarray(start, position2), referenceMap2.idsToInsert);
            referenceMap2 = null;
            return serialized;
          }
          if (encodeOptions & REUSE_BUFFER_MODE) {
            target.start = start;
            target.end = position2;
            return target;
          }
          return target.subarray(start, position2);
        } finally {
          if (sharedStructures) {
            if (serializationsSinceTransitionRebuild < 10)
              serializationsSinceTransitionRebuild++;
            if (sharedStructures.length > maxSharedStructures)
              sharedStructures.length = maxSharedStructures;
            if (transitionsCount > 1e4) {
              sharedStructures.transitions = null;
              serializationsSinceTransitionRebuild = 0;
              transitionsCount = 0;
              if (recordIdsToRemove.length > 0)
                recordIdsToRemove = [];
            } else if (recordIdsToRemove.length > 0 && !isSequential) {
              for (let i = 0, l2 = recordIdsToRemove.length; i < l2; i++) {
                recordIdsToRemove[i][RECORD_SYMBOL] = void 0;
              }
              recordIdsToRemove = [];
            }
          }
          if (hasSharedUpdate && encoder.saveShared) {
            if (encoder.structures.length > maxSharedStructures) {
              encoder.structures = encoder.structures.slice(0, maxSharedStructures);
            }
            let returnBuffer = target.subarray(start, position2);
            if (encoder.updateSharedData() === false)
              return encoder.encode(value);
            return returnBuffer;
          }
          if (encodeOptions & RESET_BUFFER_MODE)
            position2 = start;
        }
      };
      this.findCommonStringsToPack = () => {
        samplingPackedValues = /* @__PURE__ */ new Map();
        if (!sharedPackedObjectMap2)
          sharedPackedObjectMap2 = /* @__PURE__ */ Object.create(null);
        return (options2) => {
          let threshold = options2 && options2.threshold || 4;
          let position3 = this.pack ? options2.maxPrivatePackedValues || 16 : 0;
          if (!sharedValues)
            sharedValues = this.sharedValues = [];
          for (let [key, status] of samplingPackedValues) {
            if (status.count > threshold) {
              sharedPackedObjectMap2[key] = position3++;
              sharedValues.push(key);
              hasSharedUpdate = true;
            }
          }
          while (this.saveShared && this.updateSharedData() === false) {
          }
          samplingPackedValues = null;
        };
      };
      const encode2 = (value) => {
        if (position2 > safeEnd)
          target = makeRoom(position2);
        var type = typeof value;
        var length;
        if (type === "string") {
          if (packedObjectMap2) {
            let packedPosition = packedObjectMap2[value];
            if (packedPosition >= 0) {
              if (packedPosition < 16)
                target[position2++] = packedPosition + 224;
              else {
                target[position2++] = 198;
                if (packedPosition & 1)
                  encode2(15 - packedPosition >> 1);
                else
                  encode2(packedPosition - 16 >> 1);
              }
              return;
            } else if (samplingPackedValues && !options.pack) {
              let status = samplingPackedValues.get(value);
              if (status)
                status.count++;
              else
                samplingPackedValues.set(value, {
                  count: 1
                });
            }
          }
          let strLength = value.length;
          if (bundledStrings2 && strLength >= 4 && strLength < 1024) {
            if ((bundledStrings2.size += strLength) > MAX_BUNDLE_SIZE) {
              let extStart;
              let maxBytes2 = (bundledStrings2[0] ? bundledStrings2[0].length * 3 + bundledStrings2[1].length : 0) + 10;
              if (position2 + maxBytes2 > safeEnd)
                target = makeRoom(position2 + maxBytes2);
              target[position2++] = 217;
              target[position2++] = 223;
              target[position2++] = 249;
              target[position2++] = bundledStrings2.position ? 132 : 130;
              target[position2++] = 26;
              extStart = position2 - start;
              position2 += 4;
              if (bundledStrings2.position) {
                writeBundles(start, encode2);
              }
              bundledStrings2 = ["", ""];
              bundledStrings2.size = 0;
              bundledStrings2.position = extStart;
            }
            let twoByte = hasNonLatin.test(value);
            bundledStrings2[twoByte ? 0 : 1] += value;
            target[position2++] = twoByte ? 206 : 207;
            encode2(strLength);
            return;
          }
          let headerSize;
          if (strLength < 32) {
            headerSize = 1;
          } else if (strLength < 256) {
            headerSize = 2;
          } else if (strLength < 65536) {
            headerSize = 3;
          } else {
            headerSize = 5;
          }
          let maxBytes = strLength * 3;
          if (position2 + maxBytes > safeEnd)
            target = makeRoom(position2 + maxBytes);
          if (strLength < 64 || !encodeUtf8) {
            let i, c1, c2, strPosition = position2 + headerSize;
            for (i = 0; i < strLength; i++) {
              c1 = value.charCodeAt(i);
              if (c1 < 128) {
                target[strPosition++] = c1;
              } else if (c1 < 2048) {
                target[strPosition++] = c1 >> 6 | 192;
                target[strPosition++] = c1 & 63 | 128;
              } else if ((c1 & 64512) === 55296 && ((c2 = value.charCodeAt(i + 1)) & 64512) === 56320) {
                c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
                i++;
                target[strPosition++] = c1 >> 18 | 240;
                target[strPosition++] = c1 >> 12 & 63 | 128;
                target[strPosition++] = c1 >> 6 & 63 | 128;
                target[strPosition++] = c1 & 63 | 128;
              } else {
                target[strPosition++] = c1 >> 12 | 224;
                target[strPosition++] = c1 >> 6 & 63 | 128;
                target[strPosition++] = c1 & 63 | 128;
              }
            }
            length = strPosition - position2 - headerSize;
          } else {
            length = encodeUtf8(value, position2 + headerSize, maxBytes);
          }
          if (length < 24) {
            target[position2++] = 96 | length;
          } else if (length < 256) {
            if (headerSize < 2) {
              target.copyWithin(position2 + 2, position2 + 1, position2 + 1 + length);
            }
            target[position2++] = 120;
            target[position2++] = length;
          } else if (length < 65536) {
            if (headerSize < 3) {
              target.copyWithin(position2 + 3, position2 + 2, position2 + 2 + length);
            }
            target[position2++] = 121;
            target[position2++] = length >> 8;
            target[position2++] = length & 255;
          } else {
            if (headerSize < 5) {
              target.copyWithin(position2 + 5, position2 + 3, position2 + 3 + length);
            }
            target[position2++] = 122;
            targetView.setUint32(position2, length);
            position2 += 4;
          }
          position2 += length;
        } else if (type === "number") {
          if (!this.alwaysUseFloat && value >>> 0 === value) {
            if (value < 24) {
              target[position2++] = value;
            } else if (value < 256) {
              target[position2++] = 24;
              target[position2++] = value;
            } else if (value < 65536) {
              target[position2++] = 25;
              target[position2++] = value >> 8;
              target[position2++] = value & 255;
            } else {
              target[position2++] = 26;
              targetView.setUint32(position2, value);
              position2 += 4;
            }
          } else if (!this.alwaysUseFloat && value >> 0 === value) {
            if (value >= -24) {
              target[position2++] = 31 - value;
            } else if (value >= -256) {
              target[position2++] = 56;
              target[position2++] = ~value;
            } else if (value >= -65536) {
              target[position2++] = 57;
              targetView.setUint16(position2, ~value);
              position2 += 2;
            } else {
              target[position2++] = 58;
              targetView.setUint32(position2, ~value);
              position2 += 4;
            }
          } else {
            let useFloat32;
            if ((useFloat32 = this.useFloat32) > 0 && value < 4294967296 && value >= -2147483648) {
              target[position2++] = 250;
              targetView.setFloat32(position2, value);
              let xShifted;
              if (useFloat32 < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
              (xShifted = value * mult10[(target[position2] & 127) << 1 | target[position2 + 1] >> 7]) >> 0 === xShifted) {
                position2 += 4;
                return;
              } else
                position2--;
            }
            target[position2++] = 251;
            targetView.setFloat64(position2, value);
            position2 += 8;
          }
        } else if (type === "object") {
          if (!value)
            target[position2++] = 246;
          else {
            if (referenceMap2) {
              let referee = referenceMap2.get(value);
              if (referee) {
                target[position2++] = 216;
                target[position2++] = 29;
                target[position2++] = 25;
                if (!referee.references) {
                  let idsToInsert = referenceMap2.idsToInsert || (referenceMap2.idsToInsert = []);
                  referee.references = [];
                  idsToInsert.push(referee);
                }
                referee.references.push(position2 - start);
                position2 += 2;
                return;
              } else
                referenceMap2.set(value, { offset: position2 - start });
            }
            let constructor = value.constructor;
            if (constructor === Object) {
              writeObject(value, true);
            } else if (constructor === Array) {
              length = value.length;
              if (length < 24) {
                target[position2++] = 128 | length;
              } else {
                writeArrayHeader(length);
              }
              for (let i = 0; i < length; i++) {
                encode2(value[i]);
              }
            } else if (constructor === Map) {
              if (this.mapsAsObjects ? this.useTag259ForMaps !== false : this.useTag259ForMaps) {
                target[position2++] = 217;
                target[position2++] = 1;
                target[position2++] = 3;
              }
              length = value.size;
              if (length < 24) {
                target[position2++] = 160 | length;
              } else if (length < 256) {
                target[position2++] = 184;
                target[position2++] = length;
              } else if (length < 65536) {
                target[position2++] = 185;
                target[position2++] = length >> 8;
                target[position2++] = length & 255;
              } else {
                target[position2++] = 186;
                targetView.setUint32(position2, length);
                position2 += 4;
              }
              if (encoder.keyMap) {
                for (let [key, entryValue] of value) {
                  encode2(encoder.encodeKey(key));
                  encode2(entryValue);
                }
              } else {
                for (let [key, entryValue] of value) {
                  encode2(key);
                  encode2(entryValue);
                }
              }
            } else {
              for (let i = 0, l2 = extensions.length; i < l2; i++) {
                let extensionClass = extensionClasses[i];
                if (value instanceof extensionClass) {
                  let extension = extensions[i];
                  let tag = extension.tag;
                  if (tag == void 0)
                    tag = extension.getTag && extension.getTag.call(this, value);
                  if (tag < 24) {
                    target[position2++] = 192 | tag;
                  } else if (tag < 256) {
                    target[position2++] = 216;
                    target[position2++] = tag;
                  } else if (tag < 65536) {
                    target[position2++] = 217;
                    target[position2++] = tag >> 8;
                    target[position2++] = tag & 255;
                  } else if (tag > -1) {
                    target[position2++] = 218;
                    targetView.setUint32(position2, tag);
                    position2 += 4;
                  }
                  extension.encode.call(this, value, encode2, makeRoom);
                  return;
                }
              }
              if (value[Symbol.iterator]) {
                if (throwOnIterable) {
                  let error = new Error("Iterable should be serialized as iterator");
                  error.iteratorNotHandled = true;
                  throw error;
                }
                target[position2++] = 159;
                for (let entry of value) {
                  encode2(entry);
                }
                target[position2++] = 255;
                return;
              }
              if (value[Symbol.asyncIterator] || isBlob(value)) {
                let error = new Error("Iterable/blob should be serialized as iterator");
                error.iteratorNotHandled = true;
                throw error;
              }
              if (this.useToJSON && value.toJSON) {
                const json = value.toJSON();
                if (json !== value)
                  return encode2(json);
              }
              writeObject(value, !value.hasOwnProperty);
            }
          }
        } else if (type === "boolean") {
          target[position2++] = value ? 245 : 244;
        } else if (type === "bigint") {
          if (value < BigInt(1) << BigInt(64) && value >= 0) {
            target[position2++] = 27;
            targetView.setBigUint64(position2, value);
          } else if (value > -(BigInt(1) << BigInt(64)) && value < 0) {
            target[position2++] = 59;
            targetView.setBigUint64(position2, -value - BigInt(1));
          } else {
            if (this.largeBigIntToFloat) {
              target[position2++] = 251;
              targetView.setFloat64(position2, Number(value));
            } else {
              throw new RangeError(value + " was too large to fit in CBOR 64-bit integer format, set largeBigIntToFloat to convert to float-64");
            }
          }
          position2 += 8;
        } else if (type === "undefined") {
          target[position2++] = 247;
        } else {
          throw new Error("Unknown type: " + type);
        }
      };
      const writeObject = this.useRecords === false ? this.variableMapSize ? (object) => {
        let keys = Object.keys(object);
        let vals = Object.values(object);
        let length = keys.length;
        if (length < 24) {
          target[position2++] = 160 | length;
        } else if (length < 256) {
          target[position2++] = 184;
          target[position2++] = length;
        } else if (length < 65536) {
          target[position2++] = 185;
          target[position2++] = length >> 8;
          target[position2++] = length & 255;
        } else {
          target[position2++] = 186;
          targetView.setUint32(position2, length);
          position2 += 4;
        }
        let key;
        if (encoder.keyMap) {
          for (let i = 0; i < length; i++) {
            encode2(encoder.encodeKey(keys[i]));
            encode2(vals[i]);
          }
        } else {
          for (let i = 0; i < length; i++) {
            encode2(keys[i]);
            encode2(vals[i]);
          }
        }
      } : (object, safePrototype) => {
        target[position2++] = 185;
        let objectOffset = position2 - start;
        position2 += 2;
        let size = 0;
        if (encoder.keyMap) {
          for (let key in object)
            if (safePrototype || object.hasOwnProperty(key)) {
              encode2(encoder.encodeKey(key));
              encode2(object[key]);
              size++;
            }
        } else {
          for (let key in object)
            if (safePrototype || object.hasOwnProperty(key)) {
              encode2(key);
              encode2(object[key]);
              size++;
            }
        }
        target[objectOffset++ + start] = size >> 8;
        target[objectOffset + start] = size & 255;
      } : (object, safePrototype) => {
        let nextTransition, transition = structures.transitions || (structures.transitions = /* @__PURE__ */ Object.create(null));
        let newTransitions = 0;
        let length = 0;
        let parentRecordId;
        let keys;
        if (this.keyMap) {
          keys = Object.keys(object).map((k2) => this.encodeKey(k2));
          length = keys.length;
          for (let i = 0; i < length; i++) {
            let key = keys[i];
            nextTransition = transition[key];
            if (!nextTransition) {
              nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
              newTransitions++;
            }
            transition = nextTransition;
          }
        } else {
          for (let key in object)
            if (safePrototype || object.hasOwnProperty(key)) {
              nextTransition = transition[key];
              if (!nextTransition) {
                if (transition[RECORD_SYMBOL] & 1048576) {
                  parentRecordId = transition[RECORD_SYMBOL] & 65535;
                }
                nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
                newTransitions++;
              }
              transition = nextTransition;
              length++;
            }
        }
        let recordId = transition[RECORD_SYMBOL];
        if (recordId !== void 0) {
          recordId &= 65535;
          target[position2++] = 217;
          target[position2++] = recordId >> 8 | 224;
          target[position2++] = recordId & 255;
        } else {
          if (!keys)
            keys = transition.__keys__ || (transition.__keys__ = Object.keys(object));
          if (parentRecordId === void 0) {
            recordId = structures.nextId++;
            if (!recordId) {
              recordId = 0;
              structures.nextId = 1;
            }
            if (recordId >= MAX_STRUCTURES) {
              structures.nextId = (recordId = maxSharedStructures) + 1;
            }
          } else {
            recordId = parentRecordId;
          }
          structures[recordId] = keys;
          if (recordId < maxSharedStructures) {
            target[position2++] = 217;
            target[position2++] = recordId >> 8 | 224;
            target[position2++] = recordId & 255;
            transition = structures.transitions;
            for (let i = 0; i < length; i++) {
              if (transition[RECORD_SYMBOL] === void 0 || transition[RECORD_SYMBOL] & 1048576)
                transition[RECORD_SYMBOL] = recordId;
              transition = transition[keys[i]];
            }
            transition[RECORD_SYMBOL] = recordId | 1048576;
            hasSharedUpdate = true;
          } else {
            transition[RECORD_SYMBOL] = recordId;
            targetView.setUint32(position2, 3655335680);
            position2 += 3;
            if (newTransitions)
              transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
            if (recordIdsToRemove.length >= MAX_STRUCTURES - maxSharedStructures)
              recordIdsToRemove.shift()[RECORD_SYMBOL] = void 0;
            recordIdsToRemove.push(transition);
            writeArrayHeader(length + 2);
            encode2(57344 + recordId);
            encode2(keys);
            if (safePrototype === null)
              return;
            for (let key in object)
              if (safePrototype || object.hasOwnProperty(key))
                encode2(object[key]);
            return;
          }
        }
        if (length < 24) {
          target[position2++] = 128 | length;
        } else {
          writeArrayHeader(length);
        }
        if (safePrototype === null)
          return;
        for (let key in object)
          if (safePrototype || object.hasOwnProperty(key))
            encode2(object[key]);
      };
      const makeRoom = (end) => {
        let newSize;
        if (end > 16777216) {
          if (end - start > MAX_BUFFER_SIZE)
            throw new Error("Encoded buffer would be larger than maximum buffer size");
          newSize = Math.min(
            MAX_BUFFER_SIZE,
            Math.round(Math.max((end - start) * (end > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096
          );
        } else
          newSize = (Math.max(end - start << 2, target.length - 1) >> 12) + 1 << 12;
        let newBuffer = new ByteArrayAllocate(newSize);
        targetView = new DataView(newBuffer.buffer, 0, newSize);
        if (target.copy)
          target.copy(newBuffer, 0, start, end);
        else
          newBuffer.set(target.slice(start, end));
        position2 -= start;
        start = 0;
        safeEnd = newBuffer.length - 10;
        return target = newBuffer;
      };
      let chunkThreshold = 100;
      let continuedChunkThreshold = 1e3;
      this.encodeAsIterable = function(value, options2) {
        return startEncoding(value, options2, encodeObjectAsIterable);
      };
      this.encodeAsAsyncIterable = function(value, options2) {
        return startEncoding(value, options2, encodeObjectAsAsyncIterable);
      };
      function* encodeObjectAsIterable(object, iterateProperties, finalIterable) {
        let constructor = object.constructor;
        if (constructor === Object) {
          let useRecords = encoder.useRecords !== false;
          if (useRecords)
            writeObject(object, null);
          else
            writeEntityLength(Object.keys(object).length, 160);
          for (let key in object) {
            let value = object[key];
            if (!useRecords)
              encode2(key);
            if (value && typeof value === "object") {
              if (iterateProperties[key])
                yield* encodeObjectAsIterable(value, iterateProperties[key]);
              else
                yield* tryEncode(value, iterateProperties, key);
            } else
              encode2(value);
          }
        } else if (constructor === Array) {
          let length = object.length;
          writeArrayHeader(length);
          for (let i = 0; i < length; i++) {
            let value = object[i];
            if (value && (typeof value === "object" || position2 - start > chunkThreshold)) {
              if (iterateProperties.element)
                yield* encodeObjectAsIterable(value, iterateProperties.element);
              else
                yield* tryEncode(value, iterateProperties, "element");
            } else
              encode2(value);
          }
        } else if (object[Symbol.iterator]) {
          target[position2++] = 159;
          for (let value of object) {
            if (value && (typeof value === "object" || position2 - start > chunkThreshold)) {
              if (iterateProperties.element)
                yield* encodeObjectAsIterable(value, iterateProperties.element);
              else
                yield* tryEncode(value, iterateProperties, "element");
            } else
              encode2(value);
          }
          target[position2++] = 255;
        } else if (isBlob(object)) {
          writeEntityLength(object.size, 64);
          yield target.subarray(start, position2);
          yield object;
          restartEncoding();
        } else if (object[Symbol.asyncIterator]) {
          target[position2++] = 159;
          yield target.subarray(start, position2);
          yield object;
          restartEncoding();
          target[position2++] = 255;
        } else {
          encode2(object);
        }
        if (finalIterable && position2 > start)
          yield target.subarray(start, position2);
        else if (position2 - start > chunkThreshold) {
          yield target.subarray(start, position2);
          restartEncoding();
        }
      }
      function* tryEncode(value, iterateProperties, key) {
        let restart = position2 - start;
        try {
          encode2(value);
          if (position2 - start > chunkThreshold) {
            yield target.subarray(start, position2);
            restartEncoding();
          }
        } catch (error) {
          if (error.iteratorNotHandled) {
            iterateProperties[key] = {};
            position2 = start + restart;
            yield* encodeObjectAsIterable.call(this, value, iterateProperties[key]);
          } else
            throw error;
        }
      }
      function restartEncoding() {
        chunkThreshold = continuedChunkThreshold;
        encoder.encode(null, THROW_ON_ITERABLE);
      }
      function startEncoding(value, options2, encodeIterable) {
        if (options2 && options2.chunkThreshold)
          chunkThreshold = continuedChunkThreshold = options2.chunkThreshold;
        else
          chunkThreshold = 100;
        if (value && typeof value === "object") {
          encoder.encode(null, THROW_ON_ITERABLE);
          return encodeIterable(value, encoder.iterateProperties || (encoder.iterateProperties = {}), true);
        }
        return [encoder.encode(value)];
      }
      async function* encodeObjectAsAsyncIterable(value, iterateProperties) {
        for (let encodedValue of encodeObjectAsIterable(value, iterateProperties, true)) {
          let constructor = encodedValue.constructor;
          if (constructor === ByteArray || constructor === Uint8Array)
            yield encodedValue;
          else if (isBlob(encodedValue)) {
            let reader = encodedValue.stream().getReader();
            let next;
            while (!(next = await reader.read()).done) {
              yield next.value;
            }
          } else if (encodedValue[Symbol.asyncIterator]) {
            for await (let asyncValue of encodedValue) {
              restartEncoding();
              if (asyncValue)
                yield* encodeObjectAsAsyncIterable(asyncValue, iterateProperties.async || (iterateProperties.async = {}));
              else
                yield encoder.encode(asyncValue);
            }
          } else {
            yield encodedValue;
          }
        }
      }
    }
    useBuffer(buffer) {
      target = buffer;
      targetView = new DataView(target.buffer, target.byteOffset, target.byteLength);
      position2 = 0;
    }
    clearSharedData() {
      if (this.structures)
        this.structures = [];
      if (this.sharedValues)
        this.sharedValues = void 0;
    }
    updateSharedData() {
      let lastVersion = this.sharedVersion || 0;
      this.sharedVersion = lastVersion + 1;
      let structuresCopy = this.structures.slice(0);
      let sharedData = new SharedData(structuresCopy, this.sharedValues, this.sharedVersion);
      let saveResults = this.saveShared(
        sharedData,
        (existingShared) => (existingShared && existingShared.version || 0) == lastVersion
      );
      if (saveResults === false) {
        sharedData = this.getShared() || {};
        this.structures = sharedData.structures || [];
        this.sharedValues = sharedData.packedValues;
        this.sharedVersion = sharedData.version;
        this.structures.nextId = this.structures.length;
      } else {
        structuresCopy.forEach((structure, i) => this.structures[i] = structure);
      }
      return saveResults;
    }
  };
  function writeEntityLength(length, majorValue) {
    if (length < 24)
      target[position2++] = majorValue | length;
    else if (length < 256) {
      target[position2++] = majorValue | 24;
      target[position2++] = length;
    } else if (length < 65536) {
      target[position2++] = majorValue | 25;
      target[position2++] = length >> 8;
      target[position2++] = length & 255;
    } else {
      target[position2++] = majorValue | 26;
      targetView.setUint32(position2, length);
      position2 += 4;
    }
  }
  var SharedData = class {
    constructor(structures, values, version) {
      this.structures = structures;
      this.packedValues = values;
      this.version = version;
    }
  };
  function writeArrayHeader(length) {
    if (length < 24)
      target[position2++] = 128 | length;
    else if (length < 256) {
      target[position2++] = 152;
      target[position2++] = length;
    } else if (length < 65536) {
      target[position2++] = 153;
      target[position2++] = length >> 8;
      target[position2++] = length & 255;
    } else {
      target[position2++] = 154;
      targetView.setUint32(position2, length);
      position2 += 4;
    }
  }
  var BlobConstructor = typeof Blob === "undefined" ? function() {
  } : Blob;
  function isBlob(object) {
    if (object instanceof BlobConstructor)
      return true;
    let tag = object[Symbol.toStringTag];
    return tag === "Blob" || tag === "File";
  }
  function findRepetitiveStrings(value, packedValues2) {
    switch (typeof value) {
      case "string":
        if (value.length > 3) {
          if (packedValues2.objectMap[value] > -1 || packedValues2.values.length >= packedValues2.maxValues)
            return;
          let packedStatus = packedValues2.get(value);
          if (packedStatus) {
            if (++packedStatus.count == 2) {
              packedValues2.values.push(value);
            }
          } else {
            packedValues2.set(value, {
              count: 1
            });
            if (packedValues2.samplingPackedValues) {
              let status = packedValues2.samplingPackedValues.get(value);
              if (status)
                status.count++;
              else
                packedValues2.samplingPackedValues.set(value, {
                  count: 1
                });
            }
          }
        }
        break;
      case "object":
        if (value) {
          if (value instanceof Array) {
            for (let i = 0, l2 = value.length; i < l2; i++) {
              findRepetitiveStrings(value[i], packedValues2);
            }
          } else {
            let includeKeys = !packedValues2.encoder.useRecords;
            for (var key in value) {
              if (value.hasOwnProperty(key)) {
                if (includeKeys)
                  findRepetitiveStrings(key, packedValues2);
                findRepetitiveStrings(value[key], packedValues2);
              }
            }
          }
        }
        break;
      case "function":
        console.log(value);
    }
  }
  var isLittleEndianMachine2 = new Uint8Array(new Uint16Array([1]).buffer)[0] == 1;
  extensionClasses = [
    Date,
    Set,
    Error,
    RegExp,
    Tag,
    ArrayBuffer,
    Uint8Array,
    Uint8ClampedArray,
    Uint16Array,
    Uint32Array,
    typeof BigUint64Array == "undefined" ? function() {
    } : BigUint64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    typeof BigInt64Array == "undefined" ? function() {
    } : BigInt64Array,
    Float32Array,
    Float64Array,
    SharedData
  ];
  extensions = [
    {
      // Date
      tag: 1,
      encode(date, encode2) {
        let seconds = date.getTime() / 1e3;
        if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds >= 0 && seconds < 4294967296) {
          target[position2++] = 26;
          targetView.setUint32(position2, seconds);
          position2 += 4;
        } else {
          target[position2++] = 251;
          targetView.setFloat64(position2, seconds);
          position2 += 8;
        }
      }
    },
    {
      // Set
      tag: 258,
      // https://github.com/input-output-hk/cbor-sets-spec/blob/master/CBOR_SETS.md
      encode(set, encode2) {
        let array = Array.from(set);
        encode2(array);
      }
    },
    {
      // Error
      tag: 27,
      // http://cbor.schmorp.de/generic-object
      encode(error, encode2) {
        encode2([error.name, error.message]);
      }
    },
    {
      // RegExp
      tag: 27,
      // http://cbor.schmorp.de/generic-object
      encode(regex, encode2) {
        encode2(["RegExp", regex.source, regex.flags]);
      }
    },
    {
      // Tag
      getTag(tag) {
        return tag.tag;
      },
      encode(tag, encode2) {
        encode2(tag.value);
      }
    },
    {
      // ArrayBuffer
      encode(arrayBuffer, encode2, makeRoom) {
        writeBuffer(arrayBuffer, makeRoom);
      }
    },
    {
      // Uint8Array
      getTag(typedArray) {
        if (typedArray.constructor === Uint8Array) {
          if (this.tagUint8Array || hasNodeBuffer && this.tagUint8Array !== false)
            return 64;
        }
      },
      encode(typedArray, encode2, makeRoom) {
        writeBuffer(typedArray, makeRoom);
      }
    },
    typedArrayEncoder(68, 1),
    typedArrayEncoder(69, 2),
    typedArrayEncoder(70, 4),
    typedArrayEncoder(71, 8),
    typedArrayEncoder(72, 1),
    typedArrayEncoder(77, 2),
    typedArrayEncoder(78, 4),
    typedArrayEncoder(79, 8),
    typedArrayEncoder(85, 4),
    typedArrayEncoder(86, 8),
    {
      encode(sharedData, encode2) {
        let packedValues2 = sharedData.packedValues || [];
        let sharedStructures = sharedData.structures || [];
        if (packedValues2.values.length > 0) {
          target[position2++] = 216;
          target[position2++] = 51;
          writeArrayHeader(4);
          let valuesArray = packedValues2.values;
          encode2(valuesArray);
          writeArrayHeader(0);
          writeArrayHeader(0);
          packedObjectMap = Object.create(sharedPackedObjectMap || null);
          for (let i = 0, l2 = valuesArray.length; i < l2; i++) {
            packedObjectMap[valuesArray[i]] = i;
          }
        }
        if (sharedStructures) {
          targetView.setUint32(position2, 3655335424);
          position2 += 3;
          let definitions = sharedStructures.slice(0);
          definitions.unshift(57344);
          definitions.push(new Tag(sharedData.version, 1399353956));
          encode2(definitions);
        } else
          encode2(new Tag(sharedData.version, 1399353956));
      }
    }
  ];
  function typedArrayEncoder(tag, size) {
    if (!isLittleEndianMachine2 && size > 1)
      tag -= 4;
    return {
      tag,
      encode: function writeExtBuffer(typedArray, encode2) {
        let length = typedArray.byteLength;
        let offset = typedArray.byteOffset || 0;
        let buffer = typedArray.buffer || typedArray;
        encode2(hasNodeBuffer ? Buffer2.from(buffer, offset, length) : new Uint8Array(buffer, offset, length));
      }
    };
  }
  function writeBuffer(buffer, makeRoom) {
    let length = buffer.byteLength;
    if (length < 24) {
      target[position2++] = 64 + length;
    } else if (length < 256) {
      target[position2++] = 88;
      target[position2++] = length;
    } else if (length < 65536) {
      target[position2++] = 89;
      target[position2++] = length >> 8;
      target[position2++] = length & 255;
    } else {
      target[position2++] = 90;
      targetView.setUint32(position2, length);
      position2 += 4;
    }
    if (position2 + length >= target.length) {
      makeRoom(position2 + length);
    }
    target.set(buffer.buffer ? buffer : new Uint8Array(buffer), position2);
    position2 += length;
  }
  function insertIds(serialized, idsToInsert) {
    let nextId;
    let distanceToMove = idsToInsert.length * 2;
    let lastEnd = serialized.length - distanceToMove;
    idsToInsert.sort((a, b2) => a.offset > b2.offset ? 1 : -1);
    for (let id = 0; id < idsToInsert.length; id++) {
      let referee = idsToInsert[id];
      referee.id = id;
      for (let position3 of referee.references) {
        serialized[position3++] = id >> 8;
        serialized[position3] = id & 255;
      }
    }
    while (nextId = idsToInsert.pop()) {
      let offset = nextId.offset;
      serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
      distanceToMove -= 2;
      let position3 = offset + distanceToMove;
      serialized[position3++] = 216;
      serialized[position3++] = 28;
      lastEnd = offset;
    }
    return serialized;
  }
  function writeBundles(start, encode2) {
    targetView.setUint32(bundledStrings2.position + start, position2 - bundledStrings2.position - start + 1);
    let writeStrings = bundledStrings2;
    bundledStrings2 = null;
    encode2(writeStrings[0]);
    encode2(writeStrings[1]);
  }
  var defaultEncoder = new Encoder({ useRecords: false });
  var encode = defaultEncoder.encode;
  var encodeAsIterable = defaultEncoder.encodeAsIterable;
  var encodeAsAsyncIterable = defaultEncoder.encodeAsAsyncIterable;
  var { NEVER, ALWAYS, DECIMAL_ROUND, DECIMAL_FIT } = FLOAT32_OPTIONS;
  var REUSE_BUFFER_MODE = 512;
  var RESET_BUFFER_MODE = 1024;
  var THROW_ON_ITERABLE = 2048;

  // node_modules/.pnpm/peerjs@1.5.1/node_modules/peerjs/dist/bundler.mjs
  function $parcel$export(e, n, v2, s) {
    Object.defineProperty(e, n, { get: v2, set: s, enumerable: true, configurable: true });
  }
  var $fcbcc7538a6776d5$export$f1c5f4c9cb95390b = class {
    constructor() {
      this.chunkedMTU = 16300;
      this._dataCount = 1;
      this.chunk = (blob) => {
        const chunks = [];
        const size = blob.byteLength;
        const total = Math.ceil(size / this.chunkedMTU);
        let index = 0;
        let start = 0;
        while (start < size) {
          const end = Math.min(size, start + this.chunkedMTU);
          const b2 = blob.slice(start, end);
          const chunk = {
            __peerData: this._dataCount,
            n: index,
            data: b2,
            total
          };
          chunks.push(chunk);
          start = end;
          index++;
        }
        this._dataCount++;
        return chunks;
      };
    }
  };
  function $fcbcc7538a6776d5$export$52c89ebcdc4f53f2(bufs) {
    let size = 0;
    for (const buf of bufs)
      size += buf.byteLength;
    const result = new Uint8Array(size);
    let offset = 0;
    for (const buf of bufs) {
      result.set(buf, offset);
      offset += buf.byteLength;
    }
    return result;
  }
  var $fb63e766cfafaab9$var$webRTCAdapter = (
    //@ts-ignore
    (0, adapter_core_default).default || (0, adapter_core_default)
  );
  var $fb63e766cfafaab9$export$25be9502477c137d = new class {
    isWebRTCSupported() {
      return typeof RTCPeerConnection !== "undefined";
    }
    isBrowserSupported() {
      const browser = this.getBrowser();
      const version = this.getVersion();
      const validBrowser = this.supportedBrowsers.includes(browser);
      if (!validBrowser)
        return false;
      if (browser === "chrome")
        return version >= this.minChromeVersion;
      if (browser === "firefox")
        return version >= this.minFirefoxVersion;
      if (browser === "safari")
        return !this.isIOS && version >= this.minSafariVersion;
      return false;
    }
    getBrowser() {
      return $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.browser;
    }
    getVersion() {
      return $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
    }
    isUnifiedPlanSupported() {
      const browser = this.getBrowser();
      const version = $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
      if (browser === "chrome" && version < this.minChromeVersion)
        return false;
      if (browser === "firefox" && version >= this.minFirefoxVersion)
        return true;
      if (!window.RTCRtpTransceiver || !("currentDirection" in RTCRtpTransceiver.prototype))
        return false;
      let tempPc;
      let supported = false;
      try {
        tempPc = new RTCPeerConnection();
        tempPc.addTransceiver("audio");
        supported = true;
      } catch (e) {
      } finally {
        if (tempPc)
          tempPc.close();
      }
      return supported;
    }
    toString() {
      return `Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`;
    }
    constructor() {
      this.isIOS = [
        "iPad",
        "iPhone",
        "iPod"
      ].includes(navigator.platform);
      this.supportedBrowsers = [
        "firefox",
        "chrome",
        "safari"
      ];
      this.minFirefoxVersion = 59;
      this.minChromeVersion = 72;
      this.minSafariVersion = 605;
    }
  }();
  var $9a84a32bf0bf36bb$export$f35f128fd59ea256 = (id) => {
    return !id || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(id);
  };
  var $0e5fd1585784c252$export$4e61f672936bec77 = () => Math.random().toString(36).slice(2);
  var $4f4134156c446392$var$DEFAULT_CONFIG = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302"
      },
      {
        urls: [
          "turn:eu-0.turn.peerjs.com:3478",
          "turn:us-0.turn.peerjs.com:3478"
        ],
        username: "peerjs",
        credential: "peerjsp"
      }
    ],
    sdpSemantics: "unified-plan"
  };
  var $4f4134156c446392$export$f8f26dd395d7e1bd = class extends (0, $fcbcc7538a6776d5$export$f1c5f4c9cb95390b) {
    noop() {
    }
    blobToArrayBuffer(blob, cb) {
      const fr2 = new FileReader();
      fr2.onload = function(evt) {
        if (evt.target)
          cb(evt.target.result);
      };
      fr2.readAsArrayBuffer(blob);
      return fr2;
    }
    binaryStringToArrayBuffer(binary) {
      const byteArray = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++)
        byteArray[i] = binary.charCodeAt(i) & 255;
      return byteArray.buffer;
    }
    isSecure() {
      return location.protocol === "https:";
    }
    constructor(...args) {
      super(...args);
      this.CLOUD_HOST = "0.peerjs.com";
      this.CLOUD_PORT = 443;
      this.chunkedBrowsers = {
        Chrome: 1,
        chrome: 1
      };
      this.defaultConfig = $4f4134156c446392$var$DEFAULT_CONFIG;
      this.browser = (0, $fb63e766cfafaab9$export$25be9502477c137d).getBrowser();
      this.browserVersion = (0, $fb63e766cfafaab9$export$25be9502477c137d).getVersion();
      this.pack = $0cfd7828ad59115f$export$2a703dbb0cb35339;
      this.unpack = $0cfd7828ad59115f$export$417857010dc9287f;
      this.supports = function() {
        const supported = {
          browser: (0, $fb63e766cfafaab9$export$25be9502477c137d).isBrowserSupported(),
          webRTC: (0, $fb63e766cfafaab9$export$25be9502477c137d).isWebRTCSupported(),
          audioVideo: false,
          data: false,
          binaryBlob: false,
          reliable: false
        };
        if (!supported.webRTC)
          return supported;
        let pc;
        try {
          pc = new RTCPeerConnection($4f4134156c446392$var$DEFAULT_CONFIG);
          supported.audioVideo = true;
          let dc;
          try {
            dc = pc.createDataChannel("_PEERJSTEST", {
              ordered: true
            });
            supported.data = true;
            supported.reliable = !!dc.ordered;
            try {
              dc.binaryType = "blob";
              supported.binaryBlob = !(0, $fb63e766cfafaab9$export$25be9502477c137d).isIOS;
            } catch (e) {
            }
          } catch (e) {
          } finally {
            if (dc)
              dc.close();
          }
        } catch (e) {
        } finally {
          if (pc)
            pc.close();
        }
        return supported;
      }();
      this.validateId = (0, $9a84a32bf0bf36bb$export$f35f128fd59ea256);
      this.randomToken = (0, $0e5fd1585784c252$export$4e61f672936bec77);
    }
  };
  var $4f4134156c446392$export$7debb50ef11d5e0b = new $4f4134156c446392$export$f8f26dd395d7e1bd();
  var $257947e92926277a$var$LOG_PREFIX = "PeerJS: ";
  var $257947e92926277a$export$243e62d78d3b544d;
  (function(LogLevel) {
    LogLevel[LogLevel[
      /**
      * Prints no logs.
      */
      "Disabled"
    ] = 0] = "Disabled";
    LogLevel[LogLevel[
      /**
      * Prints only errors.
      */
      "Errors"
    ] = 1] = "Errors";
    LogLevel[LogLevel[
      /**
      * Prints errors and warnings.
      */
      "Warnings"
    ] = 2] = "Warnings";
    LogLevel[LogLevel[
      /**
      * Prints all logs.
      */
      "All"
    ] = 3] = "All";
  })($257947e92926277a$export$243e62d78d3b544d || ($257947e92926277a$export$243e62d78d3b544d = {}));
  var $257947e92926277a$var$Logger = class {
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(logLevel) {
      this._logLevel = logLevel;
    }
    log(...args) {
      if (this._logLevel >= $257947e92926277a$export$243e62d78d3b544d.All)
        this._print($257947e92926277a$export$243e62d78d3b544d.All, ...args);
    }
    warn(...args) {
      if (this._logLevel >= $257947e92926277a$export$243e62d78d3b544d.Warnings)
        this._print($257947e92926277a$export$243e62d78d3b544d.Warnings, ...args);
    }
    error(...args) {
      if (this._logLevel >= $257947e92926277a$export$243e62d78d3b544d.Errors)
        this._print($257947e92926277a$export$243e62d78d3b544d.Errors, ...args);
    }
    setLogFunction(fn) {
      this._print = fn;
    }
    _print(logLevel, ...rest) {
      const copy = [
        $257947e92926277a$var$LOG_PREFIX,
        ...rest
      ];
      for (const i in copy)
        if (copy[i] instanceof Error)
          copy[i] = "(" + copy[i].name + ") " + copy[i].message;
      if (logLevel >= $257947e92926277a$export$243e62d78d3b544d.All)
        console.log(...copy);
      else if (logLevel >= $257947e92926277a$export$243e62d78d3b544d.Warnings)
        console.warn("WARNING", ...copy);
      else if (logLevel >= $257947e92926277a$export$243e62d78d3b544d.Errors)
        console.error("ERROR", ...copy);
    }
    constructor() {
      this._logLevel = $257947e92926277a$export$243e62d78d3b544d.Disabled;
    }
  };
  var $257947e92926277a$export$2e2bcd8739ae039 = new $257947e92926277a$var$Logger();
  var $c4dcfd1d1ea86647$exports = {};
  var $c4dcfd1d1ea86647$var$has = Object.prototype.hasOwnProperty;
  var $c4dcfd1d1ea86647$var$prefix = "~";
  function $c4dcfd1d1ea86647$var$Events() {
  }
  if (Object.create) {
    $c4dcfd1d1ea86647$var$Events.prototype = /* @__PURE__ */ Object.create(null);
    if (!new $c4dcfd1d1ea86647$var$Events().__proto__)
      $c4dcfd1d1ea86647$var$prefix = false;
  }
  function $c4dcfd1d1ea86647$var$EE(fn, context, once2) {
    this.fn = fn;
    this.context = context;
    this.once = once2 || false;
  }
  function $c4dcfd1d1ea86647$var$addListener(emitter, event, fn, context, once2) {
    if (typeof fn !== "function")
      throw new TypeError("The listener must be a function");
    var listener = new $c4dcfd1d1ea86647$var$EE(fn, context || emitter, once2), evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
    if (!emitter._events[evt])
      emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn)
      emitter._events[evt].push(listener);
    else
      emitter._events[evt] = [
        emitter._events[evt],
        listener
      ];
    return emitter;
  }
  function $c4dcfd1d1ea86647$var$clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0)
      emitter._events = new $c4dcfd1d1ea86647$var$Events();
    else
      delete emitter._events[evt];
  }
  function $c4dcfd1d1ea86647$var$EventEmitter() {
    this._events = new $c4dcfd1d1ea86647$var$Events();
    this._eventsCount = 0;
  }
  $c4dcfd1d1ea86647$var$EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0)
      return names;
    for (name in events = this._events)
      if ($c4dcfd1d1ea86647$var$has.call(events, name))
        names.push($c4dcfd1d1ea86647$var$prefix ? name.slice(1) : name);
    if (Object.getOwnPropertySymbols)
      return names.concat(Object.getOwnPropertySymbols(events));
    return names;
  };
  $c4dcfd1d1ea86647$var$EventEmitter.prototype.listeners = function listeners(event) {
    var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event, handlers = this._events[evt];
    if (!handlers)
      return [];
    if (handlers.fn)
      return [
        handlers.fn
      ];
    for (var i = 0, l2 = handlers.length, ee2 = new Array(l2); i < l2; i++)
      ee2[i] = handlers[i].fn;
    return ee2;
  };
  $c4dcfd1d1ea86647$var$EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event, listeners2 = this._events[evt];
    if (!listeners2)
      return 0;
    if (listeners2.fn)
      return 1;
    return listeners2.length;
  };
  $c4dcfd1d1ea86647$var$EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
    if (!this._events[evt])
      return false;
    var listeners2 = this._events[evt], len = arguments.length, args, i;
    if (listeners2.fn) {
      if (listeners2.once)
        this.removeListener(event, listeners2.fn, void 0, true);
      switch (len) {
        case 1:
          return listeners2.fn.call(listeners2.context), true;
        case 2:
          return listeners2.fn.call(listeners2.context, a1), true;
        case 3:
          return listeners2.fn.call(listeners2.context, a1, a2), true;
        case 4:
          return listeners2.fn.call(listeners2.context, a1, a2, a3), true;
        case 5:
          return listeners2.fn.call(listeners2.context, a1, a2, a3, a4), true;
        case 6:
          return listeners2.fn.call(listeners2.context, a1, a2, a3, a4, a5), true;
      }
      for (i = 1, args = new Array(len - 1); i < len; i++)
        args[i - 1] = arguments[i];
      listeners2.fn.apply(listeners2.context, args);
    } else {
      var length = listeners2.length, j2;
      for (i = 0; i < length; i++) {
        if (listeners2[i].once)
          this.removeListener(event, listeners2[i].fn, void 0, true);
        switch (len) {
          case 1:
            listeners2[i].fn.call(listeners2[i].context);
            break;
          case 2:
            listeners2[i].fn.call(listeners2[i].context, a1);
            break;
          case 3:
            listeners2[i].fn.call(listeners2[i].context, a1, a2);
            break;
          case 4:
            listeners2[i].fn.call(listeners2[i].context, a1, a2, a3);
            break;
          default:
            if (!args)
              for (j2 = 1, args = new Array(len - 1); j2 < len; j2++)
                args[j2 - 1] = arguments[j2];
            listeners2[i].fn.apply(listeners2[i].context, args);
        }
      }
    }
    return true;
  };
  $c4dcfd1d1ea86647$var$EventEmitter.prototype.on = function on(event, fn, context) {
    return $c4dcfd1d1ea86647$var$addListener(this, event, fn, context, false);
  };
  $c4dcfd1d1ea86647$var$EventEmitter.prototype.once = function once(event, fn, context) {
    return $c4dcfd1d1ea86647$var$addListener(this, event, fn, context, true);
  };
  $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once2) {
    var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
    if (!this._events[evt])
      return this;
    if (!fn) {
      $c4dcfd1d1ea86647$var$clearEvent(this, evt);
      return this;
    }
    var listeners2 = this._events[evt];
    if (listeners2.fn) {
      if (listeners2.fn === fn && (!once2 || listeners2.once) && (!context || listeners2.context === context))
        $c4dcfd1d1ea86647$var$clearEvent(this, evt);
    } else {
      for (var i = 0, events = [], length = listeners2.length; i < length; i++)
        if (listeners2[i].fn !== fn || once2 && !listeners2[i].once || context && listeners2[i].context !== context)
          events.push(listeners2[i]);
      if (events.length)
        this._events[evt] = events.length === 1 ? events[0] : events;
      else
        $c4dcfd1d1ea86647$var$clearEvent(this, evt);
    }
    return this;
  };
  $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
      evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
      if (this._events[evt])
        $c4dcfd1d1ea86647$var$clearEvent(this, evt);
    } else {
      this._events = new $c4dcfd1d1ea86647$var$Events();
      this._eventsCount = 0;
    }
    return this;
  };
  $c4dcfd1d1ea86647$var$EventEmitter.prototype.off = $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener;
  $c4dcfd1d1ea86647$var$EventEmitter.prototype.addListener = $c4dcfd1d1ea86647$var$EventEmitter.prototype.on;
  $c4dcfd1d1ea86647$var$EventEmitter.prefixed = $c4dcfd1d1ea86647$var$prefix;
  $c4dcfd1d1ea86647$var$EventEmitter.EventEmitter = $c4dcfd1d1ea86647$var$EventEmitter;
  $c4dcfd1d1ea86647$exports = $c4dcfd1d1ea86647$var$EventEmitter;
  var $78455e22dea96b8c$exports = {};
  $parcel$export($78455e22dea96b8c$exports, "ConnectionType", () => $78455e22dea96b8c$export$3157d57b4135e3bc);
  $parcel$export($78455e22dea96b8c$exports, "PeerErrorType", () => $78455e22dea96b8c$export$9547aaa2e39030ff);
  $parcel$export($78455e22dea96b8c$exports, "BaseConnectionErrorType", () => $78455e22dea96b8c$export$7974935686149686);
  $parcel$export($78455e22dea96b8c$exports, "DataConnectionErrorType", () => $78455e22dea96b8c$export$49ae800c114df41d);
  $parcel$export($78455e22dea96b8c$exports, "SerializationType", () => $78455e22dea96b8c$export$89f507cf986a947);
  $parcel$export($78455e22dea96b8c$exports, "SocketEventType", () => $78455e22dea96b8c$export$3b5c4a4b6354f023);
  $parcel$export($78455e22dea96b8c$exports, "ServerMessageType", () => $78455e22dea96b8c$export$adb4a1754da6f10d);
  var $78455e22dea96b8c$export$3157d57b4135e3bc;
  (function(ConnectionType) {
    ConnectionType["Data"] = "data";
    ConnectionType["Media"] = "media";
  })($78455e22dea96b8c$export$3157d57b4135e3bc || ($78455e22dea96b8c$export$3157d57b4135e3bc = {}));
  var $78455e22dea96b8c$export$9547aaa2e39030ff;
  (function(PeerErrorType) {
    PeerErrorType[
      /**
      * The client's browser does not support some or all WebRTC features that you are trying to use.
      */
      "BrowserIncompatible"
    ] = "browser-incompatible";
    PeerErrorType[
      /**
      * You've already disconnected this peer from the server and can no longer make any new connections on it.
      */
      "Disconnected"
    ] = "disconnected";
    PeerErrorType[
      /**
      * The ID passed into the Peer constructor contains illegal characters.
      */
      "InvalidID"
    ] = "invalid-id";
    PeerErrorType[
      /**
      * The API key passed into the Peer constructor contains illegal characters or is not in the system (cloud server only).
      */
      "InvalidKey"
    ] = "invalid-key";
    PeerErrorType[
      /**
      * Lost or cannot establish a connection to the signalling server.
      */
      "Network"
    ] = "network";
    PeerErrorType[
      /**
      * The peer you're trying to connect to does not exist.
      */
      "PeerUnavailable"
    ] = "peer-unavailable";
    PeerErrorType[
      /**
      * PeerJS is being used securely, but the cloud server does not support SSL. Use a custom PeerServer.
      */
      "SslUnavailable"
    ] = "ssl-unavailable";
    PeerErrorType[
      /**
      * Unable to reach the server.
      */
      "ServerError"
    ] = "server-error";
    PeerErrorType[
      /**
      * An error from the underlying socket.
      */
      "SocketError"
    ] = "socket-error";
    PeerErrorType[
      /**
      * The underlying socket closed unexpectedly.
      */
      "SocketClosed"
    ] = "socket-closed";
    PeerErrorType[
      /**
      * The ID passed into the Peer constructor is already taken.
      *
      * :::caution
      * This error is not fatal if your peer has open peer-to-peer connections.
      * This can happen if you attempt to {@apilink Peer.reconnect} a peer that has been disconnected from the server,
      * but its old ID has now been taken.
      * :::
      */
      "UnavailableID"
    ] = "unavailable-id";
    PeerErrorType[
      /**
      * Native WebRTC errors.
      */
      "WebRTC"
    ] = "webrtc";
  })($78455e22dea96b8c$export$9547aaa2e39030ff || ($78455e22dea96b8c$export$9547aaa2e39030ff = {}));
  var $78455e22dea96b8c$export$7974935686149686;
  (function(BaseConnectionErrorType) {
    BaseConnectionErrorType["NegotiationFailed"] = "negotiation-failed";
    BaseConnectionErrorType["ConnectionClosed"] = "connection-closed";
  })($78455e22dea96b8c$export$7974935686149686 || ($78455e22dea96b8c$export$7974935686149686 = {}));
  var $78455e22dea96b8c$export$49ae800c114df41d;
  (function(DataConnectionErrorType) {
    DataConnectionErrorType["NotOpenYet"] = "not-open-yet";
    DataConnectionErrorType["MessageToBig"] = "message-too-big";
  })($78455e22dea96b8c$export$49ae800c114df41d || ($78455e22dea96b8c$export$49ae800c114df41d = {}));
  var $78455e22dea96b8c$export$89f507cf986a947;
  (function(SerializationType) {
    SerializationType["Binary"] = "binary";
    SerializationType["BinaryUTF8"] = "binary-utf8";
    SerializationType["JSON"] = "json";
    SerializationType["None"] = "raw";
  })($78455e22dea96b8c$export$89f507cf986a947 || ($78455e22dea96b8c$export$89f507cf986a947 = {}));
  var $78455e22dea96b8c$export$3b5c4a4b6354f023;
  (function(SocketEventType) {
    SocketEventType["Message"] = "message";
    SocketEventType["Disconnected"] = "disconnected";
    SocketEventType["Error"] = "error";
    SocketEventType["Close"] = "close";
  })($78455e22dea96b8c$export$3b5c4a4b6354f023 || ($78455e22dea96b8c$export$3b5c4a4b6354f023 = {}));
  var $78455e22dea96b8c$export$adb4a1754da6f10d;
  (function(ServerMessageType) {
    ServerMessageType["Heartbeat"] = "HEARTBEAT";
    ServerMessageType["Candidate"] = "CANDIDATE";
    ServerMessageType["Offer"] = "OFFER";
    ServerMessageType["Answer"] = "ANSWER";
    ServerMessageType["Open"] = "OPEN";
    ServerMessageType["Error"] = "ERROR";
    ServerMessageType["IdTaken"] = "ID-TAKEN";
    ServerMessageType["InvalidKey"] = "INVALID-KEY";
    ServerMessageType["Leave"] = "LEAVE";
    ServerMessageType["Expire"] = "EXPIRE";
  })($78455e22dea96b8c$export$adb4a1754da6f10d || ($78455e22dea96b8c$export$adb4a1754da6f10d = {}));
  var $f5f881ec4575f1fc$exports = {};
  $f5f881ec4575f1fc$exports = JSON.parse('{"name":"peerjs","version":"1.5.1","keywords":["peerjs","webrtc","p2p","rtc"],"description":"PeerJS client","homepage":"https://peerjs.com","bugs":{"url":"https://github.com/peers/peerjs/issues"},"repository":{"type":"git","url":"https://github.com/peers/peerjs"},"license":"MIT","contributors":["Michelle Bu <michelle@michellebu.com>","afrokick <devbyru@gmail.com>","ericz <really.ez@gmail.com>","Jairo <kidandcat@gmail.com>","Jonas Gloning <34194370+jonasgloning@users.noreply.github.com>","Jairo Caro-Accino Viciana <jairo@galax.be>","Carlos Caballero <carlos.caballero.gonzalez@gmail.com>","hc <hheennrryy@gmail.com>","Muhammad Asif <capripio@gmail.com>","PrashoonB <prashoonbhattacharjee@gmail.com>","Harsh Bardhan Mishra <47351025+HarshCasper@users.noreply.github.com>","akotynski <aleksanderkotbury@gmail.com>","lmb <i@lmb.io>","Jairooo <jairocaro@msn.com>","Moritz St\xFCckler <moritz.stueckler@gmail.com>","Simon <crydotsnakegithub@gmail.com>","Denis Lukov <denismassters@gmail.com>","Philipp Hancke <fippo@andyet.net>","Hans Oksendahl <hansoksendahl@gmail.com>","Jess <jessachandler@gmail.com>","khankuan <khankuan@gmail.com>","DUODVK <kurmanov.work@gmail.com>","XiZhao <kwang1imsa@gmail.com>","Matthias Lohr <matthias@lohr.me>","=frank tree <=frnktrb@googlemail.com>","Andre Eckardt <aeckardt@outlook.com>","Chris Cowan <agentme49@gmail.com>","Alex Chuev <alex@chuev.com>","alxnull <alxnull@e.mail.de>","Yemel Jardi <angel.jardi@gmail.com>","Ben Parnell <benjaminparnell.94@gmail.com>","Benny Lichtner <bennlich@gmail.com>","fresheneesz <bitetrudpublic@gmail.com>","bob.barstead@exaptive.com <bob.barstead@exaptive.com>","chandika <chandika@gmail.com>","emersion <contact@emersion.fr>","Christopher Van <cvan@users.noreply.github.com>","eddieherm <edhermoso@gmail.com>","Eduardo Pinho <enet4mikeenet@gmail.com>","Evandro Zanatta <ezanatta@tray.net.br>","Gardner Bickford <gardner@users.noreply.github.com>","Gian Luca <gianluca.cecchi@cynny.com>","PatrickJS <github@gdi2290.com>","jonnyf <github@jonathanfoss.co.uk>","Hizkia Felix <hizkifw@gmail.com>","Hristo Oskov <hristo.oskov@gmail.com>","Isaac Madwed <i.madwed@gmail.com>","Ilya Konanykhin <ilya.konanykhin@gmail.com>","jasonbarry <jasbarry@me.com>","Jonathan Burke <jonathan.burke.1311@googlemail.com>","Josh Hamit <josh.hamit@gmail.com>","Jordan Austin <jrax86@gmail.com>","Joel Wetzell <jwetzell@yahoo.com>","xizhao <kevin.wang@cloudera.com>","Alberto Torres <kungfoobar@gmail.com>","Jonathan Mayol <mayoljonathan@gmail.com>","Jefferson Felix <me@jsfelix.dev>","Rolf Erik Lekang <me@rolflekang.com>","Kevin Mai-Husan Chia <mhchia@users.noreply.github.com>","Pepijn de Vos <pepijndevos@gmail.com>","JooYoung <qkdlql@naver.com>","Tobias Speicher <rootcommander@gmail.com>","Steve Blaurock <sblaurock@gmail.com>","Kyrylo Shegeda <shegeda@ualberta.ca>","Diwank Singh Tomer <singh@diwank.name>","So\u0308ren Balko <Soeren.Balko@gmail.com>","Arpit Solanki <solankiarpit1997@gmail.com>","Yuki Ito <yuki@gnnk.net>","Artur Zayats <zag2art@gmail.com>"],"funding":{"type":"opencollective","url":"https://opencollective.com/peer"},"collective":{"type":"opencollective","url":"https://opencollective.com/peer"},"files":["dist/*"],"sideEffects":["lib/global.ts","lib/supports.ts"],"main":"dist/bundler.cjs","module":"dist/bundler.mjs","browser-minified":"dist/peerjs.min.js","browser-unminified":"dist/peerjs.js","browser-minified-cbor":"dist/serializer.cbor.mjs","browser-minified-msgpack":"dist/serializer.msgpack.mjs","types":"dist/types.d.ts","engines":{"node":">= 14"},"targets":{"types":{"source":"lib/exports.ts"},"main":{"source":"lib/exports.ts","sourceMap":{"inlineSources":true}},"module":{"source":"lib/exports.ts","includeNodeModules":["eventemitter3"],"sourceMap":{"inlineSources":true}},"browser-minified":{"context":"browser","outputFormat":"global","optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-unminified":{"context":"browser","outputFormat":"global","optimize":false,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-minified-cbor":{"context":"browser","outputFormat":"esmodule","isLibrary":true,"optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 102, safari >= 15"},"source":"lib/dataconnection/StreamConnection/Cbor.ts"},"browser-minified-msgpack":{"context":"browser","outputFormat":"esmodule","isLibrary":true,"optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 102, safari >= 15"},"source":"lib/dataconnection/StreamConnection/MsgPack.ts"}},"scripts":{"contributors":"git-authors-cli --print=false && prettier --write package.json && git add package.json package-lock.json && git commit -m \\"chore(contributors): update and sort contributors list\\"","check":"tsc --noEmit && tsc -p e2e/tsconfig.json --noEmit","watch":"parcel watch","build":"rm -rf dist && parcel build","prepublishOnly":"npm run build","test":"jest","test:watch":"jest --watch","coverage":"jest --coverage --collectCoverageFrom=\\"./lib/**\\"","format":"prettier --write .","format:check":"prettier --check .","semantic-release":"semantic-release","e2e":"wdio run e2e/wdio.local.conf.ts","e2e:bstack":"wdio run e2e/wdio.bstack.conf.ts"},"devDependencies":{"@parcel/config-default":"^2.9.3","@parcel/packager-ts":"^2.9.3","@parcel/transformer-typescript-tsc":"^2.9.3","@parcel/transformer-typescript-types":"^2.9.3","@semantic-release/changelog":"^6.0.1","@semantic-release/git":"^10.0.1","@swc/core":"^1.3.27","@swc/jest":"^0.2.24","@types/jasmine":"^4.3.4","@wdio/browserstack-service":"^8.11.2","@wdio/cli":"^8.11.2","@wdio/globals":"^8.11.2","@wdio/jasmine-framework":"^8.11.2","@wdio/local-runner":"^8.11.2","@wdio/spec-reporter":"^8.11.2","@wdio/types":"^8.10.4","http-server":"^14.1.1","jest":"^29.3.1","jest-environment-jsdom":"^29.3.1","mock-socket":"^9.0.0","parcel":"^2.9.3","prettier":"^3.0.0","semantic-release":"^21.0.0","ts-node":"^10.9.1","typescript":"^5.0.0","wdio-geckodriver-service":"^5.0.1"},"dependencies":{"@msgpack/msgpack":"^2.8.0","cbor-x":"^1.5.3","eventemitter3":"^4.0.7","peerjs-js-binarypack":"^2.0.0","webrtc-adapter":"^8.0.0"},"alias":{"process":false,"buffer":false}}');
  var $8f5bfa60836d261d$export$4798917dbf149b79 = class extends (0, $c4dcfd1d1ea86647$exports.EventEmitter) {
    constructor(secure, host, port, path, key, pingInterval = 5e3) {
      super();
      this.pingInterval = pingInterval;
      this._disconnected = true;
      this._messagesQueue = [];
      const wsProtocol = secure ? "wss://" : "ws://";
      this._baseUrl = wsProtocol + host + ":" + port + path + "peerjs?key=" + key;
    }
    start(id, token) {
      this._id = id;
      const wsUrl = `${this._baseUrl}&id=${id}&token=${token}`;
      if (!!this._socket || !this._disconnected)
        return;
      this._socket = new WebSocket(wsUrl + "&version=" + (0, $f5f881ec4575f1fc$exports.version));
      this._disconnected = false;
      this._socket.onmessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Server message received:", data);
        } catch (e) {
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Invalid server message", event.data);
          return;
        }
        this.emit((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Message, data);
      };
      this._socket.onclose = (event) => {
        if (this._disconnected)
          return;
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Socket closed.", event);
        this._cleanup();
        this._disconnected = true;
        this.emit((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Disconnected);
      };
      this._socket.onopen = () => {
        if (this._disconnected)
          return;
        this._sendQueuedMessages();
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Socket open");
        this._scheduleHeartbeat();
      };
    }
    _scheduleHeartbeat() {
      this._wsPingTimer = setTimeout(() => {
        this._sendHeartbeat();
      }, this.pingInterval);
    }
    _sendHeartbeat() {
      if (!this._wsOpen()) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Cannot send heartbeat, because socket closed`);
        return;
      }
      const message = JSON.stringify({
        type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Heartbeat
      });
      this._socket.send(message);
      this._scheduleHeartbeat();
    }
    /** Is the websocket currently open? */
    _wsOpen() {
      return !!this._socket && this._socket.readyState === 1;
    }
    /** Send queued messages. */
    _sendQueuedMessages() {
      const copiedQueue = [
        ...this._messagesQueue
      ];
      this._messagesQueue = [];
      for (const message of copiedQueue)
        this.send(message);
    }
    /** Exposed send for DC & Peer. */
    send(data) {
      if (this._disconnected)
        return;
      if (!this._id) {
        this._messagesQueue.push(data);
        return;
      }
      if (!data.type) {
        this.emit((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Error, "Invalid message");
        return;
      }
      if (!this._wsOpen())
        return;
      const message = JSON.stringify(data);
      this._socket.send(message);
    }
    close() {
      if (this._disconnected)
        return;
      this._cleanup();
      this._disconnected = true;
    }
    _cleanup() {
      if (this._socket) {
        this._socket.onopen = this._socket.onmessage = this._socket.onclose = null;
        this._socket.close();
        this._socket = void 0;
      }
      clearTimeout(this._wsPingTimer);
    }
  };
  var $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a = class {
    constructor(connection) {
      this.connection = connection;
    }
    /** Returns a PeerConnection object set up correctly (for data, media). */
    startConnection(options) {
      const peerConnection = this._startPeerConnection();
      this.connection.peerConnection = peerConnection;
      if (this.connection.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Media && options._stream)
        this._addTracksToConnection(options._stream, peerConnection);
      if (options.originator) {
        const dataConnection = this.connection;
        const config = {
          ordered: !!options.reliable
        };
        const dataChannel = peerConnection.createDataChannel(dataConnection.label, config);
        dataConnection._initializeDataChannel(dataChannel);
        this._makeOffer();
      } else
        this.handleSDP("OFFER", options.sdp);
    }
    /** Start a PC. */
    _startPeerConnection() {
      (0, $257947e92926277a$export$2e2bcd8739ae039).log("Creating RTCPeerConnection.");
      const peerConnection = new RTCPeerConnection(this.connection.provider.options.config);
      this._setupListeners(peerConnection);
      return peerConnection;
    }
    /** Set up various WebRTC listeners. */
    _setupListeners(peerConnection) {
      const peerId = this.connection.peer;
      const connectionId = this.connection.connectionId;
      const connectionType = this.connection.type;
      const provider = this.connection.provider;
      (0, $257947e92926277a$export$2e2bcd8739ae039).log("Listening for ICE candidates.");
      peerConnection.onicecandidate = (evt) => {
        if (!evt.candidate || !evt.candidate.candidate)
          return;
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Received ICE candidates for ${peerId}:`, evt.candidate);
        provider.socket.send({
          type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Candidate,
          payload: {
            candidate: evt.candidate,
            type: connectionType,
            connectionId
          },
          dst: peerId
        });
      };
      peerConnection.oniceconnectionstatechange = () => {
        switch (peerConnection.iceConnectionState) {
          case "failed":
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState is failed, closing connections to " + peerId);
            this.connection.emitError((0, $78455e22dea96b8c$export$7974935686149686).NegotiationFailed, "Negotiation of connection to " + peerId + " failed.");
            this.connection.close();
            break;
          case "closed":
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState is closed, closing connections to " + peerId);
            this.connection.emitError((0, $78455e22dea96b8c$export$7974935686149686).ConnectionClosed, "Connection to " + peerId + " closed.");
            this.connection.close();
            break;
          case "disconnected":
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState changed to disconnected on the connection with " + peerId);
            break;
          case "completed":
            peerConnection.onicecandidate = () => {
            };
            break;
        }
        this.connection.emit("iceStateChanged", peerConnection.iceConnectionState);
      };
      (0, $257947e92926277a$export$2e2bcd8739ae039).log("Listening for data channel");
      peerConnection.ondatachannel = (evt) => {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Received data channel");
        const dataChannel = evt.channel;
        const connection = provider.getConnection(peerId, connectionId);
        connection._initializeDataChannel(dataChannel);
      };
      (0, $257947e92926277a$export$2e2bcd8739ae039).log("Listening for remote stream");
      peerConnection.ontrack = (evt) => {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Received remote stream");
        const stream = evt.streams[0];
        const connection = provider.getConnection(peerId, connectionId);
        if (connection.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Media) {
          const mediaConnection = connection;
          this._addStreamToMediaConnection(stream, mediaConnection);
        }
      };
    }
    cleanup() {
      (0, $257947e92926277a$export$2e2bcd8739ae039).log("Cleaning up PeerConnection to " + this.connection.peer);
      const peerConnection = this.connection.peerConnection;
      if (!peerConnection)
        return;
      this.connection.peerConnection = null;
      peerConnection.onicecandidate = peerConnection.oniceconnectionstatechange = peerConnection.ondatachannel = peerConnection.ontrack = () => {
      };
      const peerConnectionNotClosed = peerConnection.signalingState !== "closed";
      let dataChannelNotClosed = false;
      const dataChannel = this.connection.dataChannel;
      if (dataChannel)
        dataChannelNotClosed = !!dataChannel.readyState && dataChannel.readyState !== "closed";
      if (peerConnectionNotClosed || dataChannelNotClosed)
        peerConnection.close();
    }
    async _makeOffer() {
      const peerConnection = this.connection.peerConnection;
      const provider = this.connection.provider;
      try {
        const offer = await peerConnection.createOffer(this.connection.options.constraints);
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Created offer.");
        if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function")
          offer.sdp = this.connection.options.sdpTransform(offer.sdp) || offer.sdp;
        try {
          await peerConnection.setLocalDescription(offer);
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Set localDescription:", offer, `for:${this.connection.peer}`);
          let payload = {
            sdp: offer,
            type: this.connection.type,
            connectionId: this.connection.connectionId,
            metadata: this.connection.metadata
          };
          if (this.connection.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Data) {
            const dataConnection = this.connection;
            payload = {
              ...payload,
              label: dataConnection.label,
              reliable: dataConnection.reliable,
              serialization: dataConnection.serialization
            };
          }
          provider.socket.send({
            type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Offer,
            payload,
            dst: this.connection.peer
          });
        } catch (err) {
          if (err != "OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer") {
            provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setLocalDescription, ", err);
          }
        }
      } catch (err_1) {
        provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err_1);
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to createOffer, ", err_1);
      }
    }
    async _makeAnswer() {
      const peerConnection = this.connection.peerConnection;
      const provider = this.connection.provider;
      try {
        const answer = await peerConnection.createAnswer();
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Created answer.");
        if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function")
          answer.sdp = this.connection.options.sdpTransform(answer.sdp) || answer.sdp;
        try {
          await peerConnection.setLocalDescription(answer);
          (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Set localDescription:`, answer, `for:${this.connection.peer}`);
          provider.socket.send({
            type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Answer,
            payload: {
              sdp: answer,
              type: this.connection.type,
              connectionId: this.connection.connectionId
            },
            dst: this.connection.peer
          });
        } catch (err) {
          provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setLocalDescription, ", err);
        }
      } catch (err_1) {
        provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err_1);
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to create answer, ", err_1);
      }
    }
    /** Handle an SDP. */
    async handleSDP(type, sdp2) {
      sdp2 = new RTCSessionDescription(sdp2);
      const peerConnection = this.connection.peerConnection;
      const provider = this.connection.provider;
      (0, $257947e92926277a$export$2e2bcd8739ae039).log("Setting remote description", sdp2);
      const self = this;
      try {
        await peerConnection.setRemoteDescription(sdp2);
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Set remoteDescription:${type} for:${this.connection.peer}`);
        if (type === "OFFER")
          await self._makeAnswer();
      } catch (err) {
        provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setRemoteDescription, ", err);
      }
    }
    /** Handle a candidate. */
    async handleCandidate(ice) {
      (0, $257947e92926277a$export$2e2bcd8739ae039).log(`handleCandidate:`, ice);
      try {
        await this.connection.peerConnection.addIceCandidate(ice);
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Added ICE candidate for:${this.connection.peer}`);
      } catch (err) {
        this.connection.provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to handleCandidate, ", err);
      }
    }
    _addTracksToConnection(stream, peerConnection) {
      (0, $257947e92926277a$export$2e2bcd8739ae039).log(`add tracks from stream ${stream.id} to peer connection`);
      if (!peerConnection.addTrack)
        return (0, $257947e92926277a$export$2e2bcd8739ae039).error(`Your browser does't support RTCPeerConnection#addTrack. Ignored.`);
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
    }
    _addStreamToMediaConnection(stream, mediaConnection) {
      (0, $257947e92926277a$export$2e2bcd8739ae039).log(`add stream ${stream.id} to media connection ${mediaConnection.connectionId}`);
      mediaConnection.addStream(stream);
    }
  };
  var $23779d1881157a18$export$6a678e589c8a4542 = class extends (0, $c4dcfd1d1ea86647$exports.EventEmitter) {
    /**
    * Emits a typed error message.
    *
    * @internal
    */
    emitError(type, err) {
      (0, $257947e92926277a$export$2e2bcd8739ae039).error("Error:", err);
      this.emit("error", new $23779d1881157a18$export$98871882f492de82(`${type}`, err));
    }
  };
  var $23779d1881157a18$export$98871882f492de82 = class extends Error {
    /**
    * @internal
    */
    constructor(type, err) {
      if (typeof err === "string")
        super(err);
      else {
        super();
        Object.assign(this, err);
      }
      this.type = type;
    }
  };
  var $5045192fc6d387ba$export$23a2a68283c24d80 = class extends (0, $23779d1881157a18$export$6a678e589c8a4542) {
    /**
    * Whether the media connection is active (e.g. your call has been answered).
    * You can check this if you want to set a maximum wait time for a one-sided call.
    */
    get open() {
      return this._open;
    }
    constructor(peer, provider, options) {
      super();
      this.peer = peer;
      this.provider = provider;
      this.options = options;
      this._open = false;
      this.metadata = options.metadata;
    }
  };
  var __;
  var _$5c1d08c7c57da9a3$export$4a84e95a2324ac29 = class extends (0, $5045192fc6d387ba$export$23a2a68283c24d80) {
    /**
    * For media connections, this is always 'media'.
    */
    get type() {
      return (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Media;
    }
    get localStream() {
      return this._localStream;
    }
    get remoteStream() {
      return this._remoteStream;
    }
    constructor(peerId, provider, options) {
      super(peerId, provider, options);
      this._localStream = this.options._stream;
      this.connectionId = this.options.connectionId || _$5c1d08c7c57da9a3$export$4a84e95a2324ac29.ID_PREFIX + (0, $4f4134156c446392$export$7debb50ef11d5e0b).randomToken();
      this._negotiator = new (0, $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a)(this);
      if (this._localStream)
        this._negotiator.startConnection({
          _stream: this._localStream,
          originator: true
        });
    }
    /** Called by the Negotiator when the DataChannel is ready. */
    _initializeDataChannel(dc) {
      this.dataChannel = dc;
      this.dataChannel.onopen = () => {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc connection success`);
        this.emit("willCloseOnRemote");
      };
      this.dataChannel.onclose = () => {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc closed for:`, this.peer);
        this.close();
      };
    }
    addStream(remoteStream) {
      (0, $257947e92926277a$export$2e2bcd8739ae039).log("Receiving stream", remoteStream);
      this._remoteStream = remoteStream;
      super.emit("stream", remoteStream);
    }
    /**
    * @internal
    */
    handleMessage(message) {
      const type = message.type;
      const payload = message.payload;
      switch (message.type) {
        case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Answer:
          this._negotiator.handleSDP(type, payload.sdp);
          this._open = true;
          break;
        case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Candidate:
          this._negotiator.handleCandidate(payload.candidate);
          break;
        default:
          (0, $257947e92926277a$export$2e2bcd8739ae039).warn(`Unrecognized message type:${type} from peer:${this.peer}`);
          break;
      }
    }
    /**
         * When receiving a {@apilink PeerEvents | `call`} event on a peer, you can call
         * `answer` on the media connection provided by the callback to accept the call
         * and optionally send your own media stream.
    
         *
         * @param stream A WebRTC media stream.
         * @param options
         * @returns
         */
    answer(stream, options = {}) {
      if (this._localStream) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");
        return;
      }
      this._localStream = stream;
      if (options && options.sdpTransform)
        this.options.sdpTransform = options.sdpTransform;
      this._negotiator.startConnection({
        ...this.options._payload,
        _stream: stream
      });
      const messages = this.provider._getMessages(this.connectionId);
      for (const message of messages)
        this.handleMessage(message);
      this._open = true;
    }
    /**
    * Exposed functionality for users.
    */
    /**
    * Closes the media connection.
    */
    close() {
      if (this._negotiator) {
        this._negotiator.cleanup();
        this._negotiator = null;
      }
      this._localStream = null;
      this._remoteStream = null;
      if (this.provider) {
        this.provider._removeConnection(this);
        this.provider = null;
      }
      if (this.options && this.options._stream)
        this.options._stream = null;
      if (!this.open)
        return;
      this._open = false;
      super.emit("close");
    }
  };
  var $5c1d08c7c57da9a3$export$4a84e95a2324ac29 = _$5c1d08c7c57da9a3$export$4a84e95a2324ac29;
  __ = new WeakMap();
  __privateAdd($5c1d08c7c57da9a3$export$4a84e95a2324ac29, __, (() => {
    _$5c1d08c7c57da9a3$export$4a84e95a2324ac29.ID_PREFIX = "mc_";
  })());
  var $abf266641927cd89$export$2c4e825dc9120f87 = class {
    constructor(_options) {
      this._options = _options;
    }
    _buildRequest(method) {
      const protocol = this._options.secure ? "https" : "http";
      const { host, port, path, key } = this._options;
      const url = new URL(`${protocol}://${host}:${port}${path}${key}/${method}`);
      url.searchParams.set("ts", `${Date.now()}${Math.random()}`);
      url.searchParams.set("version", (0, $f5f881ec4575f1fc$exports.version));
      return fetch(url.href, {
        referrerPolicy: this._options.referrerPolicy
      });
    }
    /** Get a unique ID from the server via XHR and initialize with it. */
    async retrieveId() {
      try {
        const response = await this._buildRequest("id");
        if (response.status !== 200)
          throw new Error(`Error. Status:${response.status}`);
        return response.text();
      } catch (error) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).error("Error retrieving ID", error);
        let pathError = "";
        if (this._options.path === "/" && this._options.host !== (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST)
          pathError = " If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer.";
        throw new Error("Could not get an ID from the server." + pathError);
      }
    }
    /** @deprecated */
    async listAllPeers() {
      try {
        const response = await this._buildRequest("peers");
        if (response.status !== 200) {
          if (response.status === 401) {
            let helpfulError = "";
            if (this._options.host === (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST)
              helpfulError = "It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.";
            else
              helpfulError = "You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.";
            throw new Error("It doesn't look like you have permission to list peers IDs. " + helpfulError);
          }
          throw new Error(`Error. Status:${response.status}`);
        }
        return response.json();
      } catch (error) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).error("Error retrieving list peers", error);
        throw new Error("Could not get list peers from the server." + error);
      }
    }
  };
  var __2, __1;
  var _$6366c4ca161bc297$export$d365f7ad9d7df9c9 = class extends (0, $5045192fc6d387ba$export$23a2a68283c24d80) {
    get type() {
      return (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Data;
    }
    constructor(peerId, provider, options) {
      super(peerId, provider, options);
      this.connectionId = this.options.connectionId || _$6366c4ca161bc297$export$d365f7ad9d7df9c9.ID_PREFIX + (0, $0e5fd1585784c252$export$4e61f672936bec77)();
      this.label = this.options.label || this.connectionId;
      this.reliable = !!this.options.reliable;
      this._negotiator = new (0, $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a)(this);
      this._negotiator.startConnection(this.options._payload || {
        originator: true,
        reliable: this.reliable
      });
    }
    /** Called by the Negotiator when the DataChannel is ready. */
    _initializeDataChannel(dc) {
      this.dataChannel = dc;
      this.dataChannel.onopen = () => {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc connection success`);
        this._open = true;
        this.emit("open");
      };
      this.dataChannel.onmessage = (e) => {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc onmessage:`, e.data);
      };
      this.dataChannel.onclose = () => {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc closed for:`, this.peer);
        this.close();
      };
    }
    /**
    * Exposed functionality for users.
    */
    /** Allows user to close connection. */
    close(options) {
      if (options?.flush) {
        this.send({
          __peerData: {
            type: "close"
          }
        });
        return;
      }
      if (this._negotiator) {
        this._negotiator.cleanup();
        this._negotiator = null;
      }
      if (this.provider) {
        this.provider._removeConnection(this);
        this.provider = null;
      }
      if (this.dataChannel) {
        this.dataChannel.onopen = null;
        this.dataChannel.onmessage = null;
        this.dataChannel.onclose = null;
        this.dataChannel = null;
      }
      if (!this.open)
        return;
      this._open = false;
      super.emit("close");
    }
    /** Allows user to send data. */
    send(data, chunked = false) {
      if (!this.open) {
        this.emitError((0, $78455e22dea96b8c$export$49ae800c114df41d).NotOpenYet, "Connection is not open. You should listen for the `open` event before sending messages.");
        return;
      }
      return this._send(data, chunked);
    }
    async handleMessage(message) {
      const payload = message.payload;
      switch (message.type) {
        case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Answer:
          await this._negotiator.handleSDP(message.type, payload.sdp);
          break;
        case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Candidate:
          await this._negotiator.handleCandidate(payload.candidate);
          break;
        default:
          (0, $257947e92926277a$export$2e2bcd8739ae039).warn("Unrecognized message type:", message.type, "from peer:", this.peer);
          break;
      }
    }
  };
  var $6366c4ca161bc297$export$d365f7ad9d7df9c9 = _$6366c4ca161bc297$export$d365f7ad9d7df9c9;
  __2 = new WeakMap();
  __1 = new WeakMap();
  __privateAdd($6366c4ca161bc297$export$d365f7ad9d7df9c9, __2, (() => {
    _$6366c4ca161bc297$export$d365f7ad9d7df9c9.ID_PREFIX = "dc_";
  })());
  __privateAdd($6366c4ca161bc297$export$d365f7ad9d7df9c9, __1, (() => {
    _$6366c4ca161bc297$export$d365f7ad9d7df9c9.MAX_BUFFERED_AMOUNT = 8388608;
  })());
  var $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b = class extends (0, $6366c4ca161bc297$export$d365f7ad9d7df9c9) {
    get bufferSize() {
      return this._bufferSize;
    }
    _initializeDataChannel(dc) {
      super._initializeDataChannel(dc);
      this.dataChannel.binaryType = "arraybuffer";
      this.dataChannel.addEventListener("message", (e) => this._handleDataMessage(e));
    }
    _bufferedSend(msg) {
      if (this._buffering || !this._trySend(msg)) {
        this._buffer.push(msg);
        this._bufferSize = this._buffer.length;
      }
    }
    // Returns true if the send succeeds.
    _trySend(msg) {
      if (!this.open)
        return false;
      if (this.dataChannel.bufferedAmount > (0, $6366c4ca161bc297$export$d365f7ad9d7df9c9).MAX_BUFFERED_AMOUNT) {
        this._buffering = true;
        setTimeout(() => {
          this._buffering = false;
          this._tryBuffer();
        }, 50);
        return false;
      }
      try {
        this.dataChannel.send(msg);
      } catch (e) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).error(`DC#:${this.connectionId} Error when sending:`, e);
        this._buffering = true;
        this.close();
        return false;
      }
      return true;
    }
    // Try to send the first message in the buffer.
    _tryBuffer() {
      if (!this.open)
        return;
      if (this._buffer.length === 0)
        return;
      const msg = this._buffer[0];
      if (this._trySend(msg)) {
        this._buffer.shift();
        this._bufferSize = this._buffer.length;
        this._tryBuffer();
      }
    }
    close(options) {
      if (options?.flush) {
        this.send({
          __peerData: {
            type: "close"
          }
        });
        return;
      }
      this._buffer = [];
      this._bufferSize = 0;
      super.close();
    }
    constructor(...args) {
      super(...args);
      this._buffer = [];
      this._bufferSize = 0;
      this._buffering = false;
    }
  };
  var $9fcfddb3ae148f88$export$f0a5a64d5bb37108 = class extends (0, $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
    close(options) {
      super.close(options);
      this._chunkedData = {};
    }
    constructor(peerId, provider, options) {
      super(peerId, provider, options);
      this.chunker = new (0, $fcbcc7538a6776d5$export$f1c5f4c9cb95390b)();
      this.serialization = (0, $78455e22dea96b8c$export$89f507cf986a947).Binary;
      this._chunkedData = {};
    }
    // Handles a DataChannel message.
    _handleDataMessage({ data }) {
      const deserializedData = (0, $0cfd7828ad59115f$export$417857010dc9287f)(data);
      const peerData = deserializedData["__peerData"];
      if (peerData) {
        if (peerData.type === "close") {
          this.close();
          return;
        }
        this._handleChunk(deserializedData);
        return;
      }
      this.emit("data", deserializedData);
    }
    _handleChunk(data) {
      const id = data.__peerData;
      const chunkInfo = this._chunkedData[id] || {
        data: [],
        count: 0,
        total: data.total
      };
      chunkInfo.data[data.n] = new Uint8Array(data.data);
      chunkInfo.count++;
      this._chunkedData[id] = chunkInfo;
      if (chunkInfo.total === chunkInfo.count) {
        delete this._chunkedData[id];
        const data2 = (0, $fcbcc7538a6776d5$export$52c89ebcdc4f53f2)(chunkInfo.data);
        this._handleDataMessage({
          data: data2
        });
      }
    }
    _send(data, chunked) {
      if (data instanceof Blob)
        return data.arrayBuffer().then((buffer) => {
          this._send(buffer, chunked);
        });
      const blob = (0, $0cfd7828ad59115f$export$2a703dbb0cb35339)(data);
      if (!chunked && blob.byteLength > this.chunker.chunkedMTU) {
        this._sendChunks(blob);
        return;
      }
      this._bufferedSend(blob);
    }
    _sendChunks(blob) {
      const blobs = this.chunker.chunk(blob);
      (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} Try to send ${blobs.length} chunks...`);
      for (const blob2 of blobs)
        this.send(blob2, true);
    }
  };
  var $bbaee3f15f714663$export$6f88fe47d32c9c94 = class extends (0, $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
    _handleDataMessage({ data }) {
      super.emit("data", data);
    }
    _send(data, _chunked) {
      this._bufferedSend(data);
    }
    constructor(...args) {
      super(...args);
      this.serialization = (0, $78455e22dea96b8c$export$89f507cf986a947).None;
    }
  };
  var $817f931e3f9096cf$export$48880ac635f47186 = class extends (0, $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
    // Handles a DataChannel message.
    _handleDataMessage({ data }) {
      const deserializedData = this.parse(this.decoder.decode(data));
      const peerData = deserializedData["__peerData"];
      if (peerData && peerData.type === "close") {
        this.close();
        return;
      }
      this.emit("data", deserializedData);
    }
    _send(data, _chunked) {
      const encodedData = this.encoder.encode(this.stringify(data));
      if (encodedData.byteLength >= (0, $4f4134156c446392$export$7debb50ef11d5e0b).chunkedMTU) {
        this.emitError((0, $78455e22dea96b8c$export$49ae800c114df41d).MessageToBig, "Message too big for JSON channel");
        return;
      }
      this._bufferedSend(encodedData);
    }
    constructor(...args) {
      super(...args);
      this.serialization = (0, $78455e22dea96b8c$export$89f507cf986a947).JSON;
      this.encoder = new TextEncoder();
      this.decoder = new TextDecoder();
      this.stringify = JSON.stringify;
      this.parse = JSON.parse;
    }
  };
  var __3;
  var _$416260bce337df90$export$ecd1fc136c422448 = class extends (0, $23779d1881157a18$export$6a678e589c8a4542) {
    /**
    * The brokering ID of this peer
    *
    * If no ID was specified in {@apilink Peer | the constructor},
    * this will be `undefined` until the {@apilink PeerEvents | `open`} event is emitted.
    */
    get id() {
      return this._id;
    }
    get options() {
      return this._options;
    }
    get open() {
      return this._open;
    }
    /**
    * @internal
    */
    get socket() {
      return this._socket;
    }
    /**
    * A hash of all connections associated with this peer, keyed by the remote peer's ID.
    * @deprecated
    * Return type will change from Object to Map<string,[]>
    */
    get connections() {
      const plainConnections = /* @__PURE__ */ Object.create(null);
      for (const [k2, v2] of this._connections)
        plainConnections[k2] = v2;
      return plainConnections;
    }
    /**
    * true if this peer and all of its connections can no longer be used.
    */
    get destroyed() {
      return this._destroyed;
    }
    /**
    * false if there is an active connection to the PeerServer.
    */
    get disconnected() {
      return this._disconnected;
    }
    constructor(id, options) {
      super();
      this._serializers = {
        raw: (0, $bbaee3f15f714663$export$6f88fe47d32c9c94),
        json: (0, $817f931e3f9096cf$export$48880ac635f47186),
        binary: (0, $9fcfddb3ae148f88$export$f0a5a64d5bb37108),
        "binary-utf8": (0, $9fcfddb3ae148f88$export$f0a5a64d5bb37108),
        default: (0, $9fcfddb3ae148f88$export$f0a5a64d5bb37108)
      };
      this._id = null;
      this._lastServerId = null;
      this._destroyed = false;
      this._disconnected = false;
      this._open = false;
      this._connections = /* @__PURE__ */ new Map();
      this._lostMessages = /* @__PURE__ */ new Map();
      let userId;
      if (id && id.constructor == Object)
        options = id;
      else if (id)
        userId = id.toString();
      options = {
        debug: 0,
        host: (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST,
        port: (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_PORT,
        path: "/",
        key: _$416260bce337df90$export$ecd1fc136c422448.DEFAULT_KEY,
        token: (0, $4f4134156c446392$export$7debb50ef11d5e0b).randomToken(),
        config: (0, $4f4134156c446392$export$7debb50ef11d5e0b).defaultConfig,
        referrerPolicy: "strict-origin-when-cross-origin",
        serializers: {},
        ...options
      };
      this._options = options;
      this._serializers = {
        ...this._serializers,
        ...this.options.serializers
      };
      if (this._options.host === "/")
        this._options.host = window.location.hostname;
      if (this._options.path) {
        if (this._options.path[0] !== "/")
          this._options.path = "/" + this._options.path;
        if (this._options.path[this._options.path.length - 1] !== "/")
          this._options.path += "/";
      }
      if (this._options.secure === void 0 && this._options.host !== (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST)
        this._options.secure = (0, $4f4134156c446392$export$7debb50ef11d5e0b).isSecure();
      else if (this._options.host == (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST)
        this._options.secure = true;
      if (this._options.logFunction)
        (0, $257947e92926277a$export$2e2bcd8739ae039).setLogFunction(this._options.logFunction);
      (0, $257947e92926277a$export$2e2bcd8739ae039).logLevel = this._options.debug || 0;
      this._api = new (0, $abf266641927cd89$export$2c4e825dc9120f87)(options);
      this._socket = this._createServerConnection();
      if (!(0, $4f4134156c446392$export$7debb50ef11d5e0b).supports.audioVideo && !(0, $4f4134156c446392$export$7debb50ef11d5e0b).supports.data) {
        this._delayedAbort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).BrowserIncompatible, "The current browser does not support WebRTC");
        return;
      }
      if (!!userId && !(0, $4f4134156c446392$export$7debb50ef11d5e0b).validateId(userId)) {
        this._delayedAbort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).InvalidID, `ID "${userId}" is invalid`);
        return;
      }
      if (userId)
        this._initialize(userId);
      else
        this._api.retrieveId().then((id2) => this._initialize(id2)).catch((error) => this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, error));
    }
    _createServerConnection() {
      const socket = new (0, $8f5bfa60836d261d$export$4798917dbf149b79)(this._options.secure, this._options.host, this._options.port, this._options.path, this._options.key, this._options.pingInterval);
      socket.on((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Message, (data) => {
        this._handleMessage(data);
      });
      socket.on((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Error, (error) => {
        this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).SocketError, error);
      });
      socket.on((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Disconnected, () => {
        if (this.disconnected)
          return;
        this.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).Network, "Lost connection to server.");
        this.disconnect();
      });
      socket.on((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Close, () => {
        if (this.disconnected)
          return;
        this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).SocketClosed, "Underlying socket is already closed.");
      });
      return socket;
    }
    /** Initialize a connection with the server. */
    _initialize(id) {
      this._id = id;
      this.socket.start(id, this._options.token);
    }
    /** Handles messages from the server. */
    _handleMessage(message) {
      const type = message.type;
      const payload = message.payload;
      const peerId = message.src;
      switch (type) {
        case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Open:
          this._lastServerId = this.id;
          this._open = true;
          this.emit("open", this.id);
          break;
        case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Error:
          this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, payload.msg);
          break;
        case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).IdTaken:
          this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).UnavailableID, `ID "${this.id}" is taken`);
          break;
        case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).InvalidKey:
          this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).InvalidKey, `API KEY "${this._options.key}" is invalid`);
          break;
        case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Leave:
          (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Received leave message from ${peerId}`);
          this._cleanupPeer(peerId);
          this._connections.delete(peerId);
          break;
        case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Expire:
          this.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).PeerUnavailable, `Could not connect to peer ${peerId}`);
          break;
        case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Offer: {
          const connectionId = payload.connectionId;
          let connection = this.getConnection(peerId, connectionId);
          if (connection) {
            connection.close();
            (0, $257947e92926277a$export$2e2bcd8739ae039).warn(`Offer received for existing Connection ID:${connectionId}`);
          }
          if (payload.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Media) {
            const mediaConnection = new (0, $5c1d08c7c57da9a3$export$4a84e95a2324ac29)(peerId, this, {
              connectionId,
              _payload: payload,
              metadata: payload.metadata
            });
            connection = mediaConnection;
            this._addConnection(peerId, connection);
            this.emit("call", mediaConnection);
          } else if (payload.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Data) {
            const dataConnection = new this._serializers[payload.serialization](peerId, this, {
              connectionId,
              _payload: payload,
              metadata: payload.metadata,
              label: payload.label,
              serialization: payload.serialization,
              reliable: payload.reliable
            });
            connection = dataConnection;
            this._addConnection(peerId, connection);
            this.emit("connection", dataConnection);
          } else {
            (0, $257947e92926277a$export$2e2bcd8739ae039).warn(`Received malformed connection type:${payload.type}`);
            return;
          }
          const messages = this._getMessages(connectionId);
          for (const message2 of messages)
            connection.handleMessage(message2);
          break;
        }
        default: {
          if (!payload) {
            (0, $257947e92926277a$export$2e2bcd8739ae039).warn(`You received a malformed message from ${peerId} of type ${type}`);
            return;
          }
          const connectionId = payload.connectionId;
          const connection = this.getConnection(peerId, connectionId);
          if (connection && connection.peerConnection)
            connection.handleMessage(message);
          else if (connectionId)
            this._storeMessage(connectionId, message);
          else
            (0, $257947e92926277a$export$2e2bcd8739ae039).warn("You received an unrecognized message:", message);
          break;
        }
      }
    }
    /** Stores messages without a set up connection, to be claimed later. */
    _storeMessage(connectionId, message) {
      if (!this._lostMessages.has(connectionId))
        this._lostMessages.set(connectionId, []);
      this._lostMessages.get(connectionId).push(message);
    }
    /**
    * Retrieve messages from lost message store
    * @internal
    */
    //TODO Change it to private
    _getMessages(connectionId) {
      const messages = this._lostMessages.get(connectionId);
      if (messages) {
        this._lostMessages.delete(connectionId);
        return messages;
      }
      return [];
    }
    /**
    * Connects to the remote peer specified by id and returns a data connection.
    * @param peer The brokering ID of the remote peer (their {@apilink Peer.id}).
    * @param options for specifying details about Peer Connection
    */
    connect(peer, options = {}) {
      options = {
        serialization: "default",
        ...options
      };
      if (this.disconnected) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available.");
        this.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).Disconnected, "Cannot connect to new Peer after disconnecting from server.");
        return;
      }
      const dataConnection = new this._serializers[options.serialization](peer, this, options);
      this._addConnection(peer, dataConnection);
      return dataConnection;
    }
    /**
    * Calls the remote peer specified by id and returns a media connection.
    * @param peer The brokering ID of the remote peer (their peer.id).
    * @param stream The caller's media stream
    * @param options Metadata associated with the connection, passed in by whoever initiated the connection.
    */
    call(peer, stream, options = {}) {
      if (this.disconnected) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect.");
        this.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).Disconnected, "Cannot connect to new Peer after disconnecting from server.");
        return;
      }
      if (!stream) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");
        return;
      }
      const mediaConnection = new (0, $5c1d08c7c57da9a3$export$4a84e95a2324ac29)(peer, this, {
        ...options,
        _stream: stream
      });
      this._addConnection(peer, mediaConnection);
      return mediaConnection;
    }
    /** Add a data/media connection to this peer. */
    _addConnection(peerId, connection) {
      (0, $257947e92926277a$export$2e2bcd8739ae039).log(`add connection ${connection.type}:${connection.connectionId} to peerId:${peerId}`);
      if (!this._connections.has(peerId))
        this._connections.set(peerId, []);
      this._connections.get(peerId).push(connection);
    }
    //TODO should be private
    _removeConnection(connection) {
      const connections = this._connections.get(connection.peer);
      if (connections) {
        const index = connections.indexOf(connection);
        if (index !== -1)
          connections.splice(index, 1);
      }
      this._lostMessages.delete(connection.connectionId);
    }
    /** Retrieve a data/media connection for this peer. */
    getConnection(peerId, connectionId) {
      const connections = this._connections.get(peerId);
      if (!connections)
        return null;
      for (const connection of connections) {
        if (connection.connectionId === connectionId)
          return connection;
      }
      return null;
    }
    _delayedAbort(type, message) {
      setTimeout(() => {
        this._abort(type, message);
      }, 0);
    }
    /**
    * Emits an error message and destroys the Peer.
    * The Peer is not destroyed if it's in a disconnected state, in which case
    * it retains its disconnected state and its existing connections.
    */
    _abort(type, message) {
      (0, $257947e92926277a$export$2e2bcd8739ae039).error("Aborting!");
      this.emitError(type, message);
      if (!this._lastServerId)
        this.destroy();
      else
        this.disconnect();
    }
    /**
    * Destroys the Peer: closes all active connections as well as the connection
    * to the server.
    *
    * :::caution
    * This cannot be undone; the respective peer object will no longer be able
    * to create or receive any connections, its ID will be forfeited on the server,
    * and all of its data and media connections will be closed.
    * :::
    */
    destroy() {
      if (this.destroyed)
        return;
      (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Destroy peer with ID:${this.id}`);
      this.disconnect();
      this._cleanup();
      this._destroyed = true;
      this.emit("close");
    }
    /** Disconnects every connection on this peer. */
    _cleanup() {
      for (const peerId of this._connections.keys()) {
        this._cleanupPeer(peerId);
        this._connections.delete(peerId);
      }
      this.socket.removeAllListeners();
    }
    /** Closes all connections to this peer. */
    _cleanupPeer(peerId) {
      const connections = this._connections.get(peerId);
      if (!connections)
        return;
      for (const connection of connections)
        connection.close();
    }
    /**
    * Disconnects the Peer's connection to the PeerServer. Does not close any
    *  active connections.
    * Warning: The peer can no longer create or accept connections after being
    *  disconnected. It also cannot reconnect to the server.
    */
    disconnect() {
      if (this.disconnected)
        return;
      const currentId = this.id;
      (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Disconnect peer with ID:${currentId}`);
      this._disconnected = true;
      this._open = false;
      this.socket.close();
      this._lastServerId = currentId;
      this._id = null;
      this.emit("disconnected", currentId);
    }
    /** Attempts to reconnect with the same ID.
    *
    * Only {@apilink Peer.disconnect | disconnected peers} can be reconnected.
    * Destroyed peers cannot be reconnected.
    * If the connection fails (as an example, if the peer's old ID is now taken),
    * the peer's existing connections will not close, but any associated errors events will fire.
    */
    reconnect() {
      if (this.disconnected && !this.destroyed) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Attempting reconnection to server with ID ${this._lastServerId}`);
        this._disconnected = false;
        this._initialize(this._lastServerId);
      } else if (this.destroyed)
        throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");
      else if (!this.disconnected && !this.open)
        (0, $257947e92926277a$export$2e2bcd8739ae039).error("In a hurry? We're still trying to make the initial connection!");
      else
        throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`);
    }
    /**
    * Get a list of available peer IDs. If you're running your own server, you'll
    * want to set allow_discovery: true in the PeerServer options. If you're using
    * the cloud server, email team@peerjs.com to get the functionality enabled for
    * your key.
    */
    listAllPeers(cb = (_2) => {
    }) {
      this._api.listAllPeers().then((peers) => cb(peers)).catch((error) => this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, error));
    }
  };
  var $416260bce337df90$export$ecd1fc136c422448 = _$416260bce337df90$export$ecd1fc136c422448;
  __3 = new WeakMap();
  __privateAdd($416260bce337df90$export$ecd1fc136c422448, __3, (() => {
    _$416260bce337df90$export$ecd1fc136c422448.DEFAULT_KEY = "peerjs";
  })());
  var $dcf98445f54823f4$var$NullValue = Symbol.for(null);

  // node_modules/.pnpm/tweakpane@4.0.1/node_modules/tweakpane/dist/tweakpane.js
  function forceCast(v2) {
    return v2;
  }
  function isEmpty(value) {
    return value === null || value === void 0;
  }
  function isObject$1(value) {
    return value !== null && typeof value === "object";
  }
  function isRecord(value) {
    return value !== null && typeof value === "object";
  }
  function deepEqualsArray(a1, a2) {
    if (a1.length !== a2.length) {
      return false;
    }
    for (let i = 0; i < a1.length; i++) {
      if (a1[i] !== a2[i]) {
        return false;
      }
    }
    return true;
  }
  function deepMerge(r1, r2) {
    const keys = Array.from(/* @__PURE__ */ new Set([...Object.keys(r1), ...Object.keys(r2)]));
    return keys.reduce((result, key) => {
      const v1 = r1[key];
      const v2 = r2[key];
      return isRecord(v1) && isRecord(v2) ? Object.assign(Object.assign({}, result), { [key]: deepMerge(v1, v2) }) : Object.assign(Object.assign({}, result), { [key]: key in r2 ? v2 : v1 });
    }, {});
  }
  function isBinding(value) {
    if (!isObject$1(value)) {
      return false;
    }
    return "target" in value;
  }
  var CREATE_MESSAGE_MAP = {
    alreadydisposed: () => "View has been already disposed",
    invalidparams: (context) => `Invalid parameters for '${context.name}'`,
    nomatchingcontroller: (context) => `No matching controller for '${context.key}'`,
    nomatchingview: (context) => `No matching view for '${JSON.stringify(context.params)}'`,
    notbindable: () => `Value is not bindable`,
    notcompatible: (context) => `Not compatible with  plugin '${context.id}'`,
    propertynotfound: (context) => `Property '${context.name}' not found`,
    shouldneverhappen: () => "This error should never happen"
  };
  var TpError = class {
    static alreadyDisposed() {
      return new TpError({ type: "alreadydisposed" });
    }
    static notBindable() {
      return new TpError({
        type: "notbindable"
      });
    }
    static notCompatible(bundleId, id) {
      return new TpError({
        type: "notcompatible",
        context: {
          id: `${bundleId}.${id}`
        }
      });
    }
    static propertyNotFound(name) {
      return new TpError({
        type: "propertynotfound",
        context: {
          name
        }
      });
    }
    static shouldNeverHappen() {
      return new TpError({ type: "shouldneverhappen" });
    }
    constructor(config) {
      var _a;
      this.message = (_a = CREATE_MESSAGE_MAP[config.type](forceCast(config.context))) !== null && _a !== void 0 ? _a : "Unexpected error";
      this.name = this.constructor.name;
      this.stack = new Error(this.message).stack;
      this.type = config.type;
    }
    toString() {
      return this.message;
    }
  };
  var BindingTarget = class {
    constructor(obj, key) {
      this.obj_ = obj;
      this.key = key;
    }
    static isBindable(obj) {
      if (obj === null) {
        return false;
      }
      if (typeof obj !== "object" && typeof obj !== "function") {
        return false;
      }
      return true;
    }
    read() {
      return this.obj_[this.key];
    }
    write(value) {
      this.obj_[this.key] = value;
    }
    writeProperty(name, value) {
      const valueObj = this.read();
      if (!BindingTarget.isBindable(valueObj)) {
        throw TpError.notBindable();
      }
      if (!(name in valueObj)) {
        throw TpError.propertyNotFound(name);
      }
      valueObj[name] = value;
    }
  };
  var Emitter = class {
    constructor() {
      this.observers_ = {};
    }
    on(eventName, handler) {
      let observers = this.observers_[eventName];
      if (!observers) {
        observers = this.observers_[eventName] = [];
      }
      observers.push({
        handler
      });
      return this;
    }
    off(eventName, handler) {
      const observers = this.observers_[eventName];
      if (observers) {
        this.observers_[eventName] = observers.filter((observer) => {
          return observer.handler !== handler;
        });
      }
      return this;
    }
    emit(eventName, event) {
      const observers = this.observers_[eventName];
      if (!observers) {
        return;
      }
      observers.forEach((observer) => {
        observer.handler(event);
      });
    }
  };
  var ComplexValue = class {
    constructor(initialValue, config) {
      var _a;
      this.constraint_ = config === null || config === void 0 ? void 0 : config.constraint;
      this.equals_ = (_a = config === null || config === void 0 ? void 0 : config.equals) !== null && _a !== void 0 ? _a : (v1, v2) => v1 === v2;
      this.emitter = new Emitter();
      this.rawValue_ = initialValue;
    }
    get constraint() {
      return this.constraint_;
    }
    get rawValue() {
      return this.rawValue_;
    }
    set rawValue(rawValue) {
      this.setRawValue(rawValue, {
        forceEmit: false,
        last: true
      });
    }
    setRawValue(rawValue, options) {
      const opts = options !== null && options !== void 0 ? options : {
        forceEmit: false,
        last: true
      };
      const constrainedValue = this.constraint_ ? this.constraint_.constrain(rawValue) : rawValue;
      const prevValue = this.rawValue_;
      const changed = !this.equals_(prevValue, constrainedValue);
      if (!changed && !opts.forceEmit) {
        return;
      }
      this.emitter.emit("beforechange", {
        sender: this
      });
      this.rawValue_ = constrainedValue;
      this.emitter.emit("change", {
        options: opts,
        previousRawValue: prevValue,
        rawValue: constrainedValue,
        sender: this
      });
    }
  };
  var PrimitiveValue = class {
    constructor(initialValue) {
      this.emitter = new Emitter();
      this.value_ = initialValue;
    }
    get rawValue() {
      return this.value_;
    }
    set rawValue(value) {
      this.setRawValue(value, {
        forceEmit: false,
        last: true
      });
    }
    setRawValue(value, options) {
      const opts = options !== null && options !== void 0 ? options : {
        forceEmit: false,
        last: true
      };
      const prevValue = this.value_;
      if (prevValue === value && !opts.forceEmit) {
        return;
      }
      this.emitter.emit("beforechange", {
        sender: this
      });
      this.value_ = value;
      this.emitter.emit("change", {
        options: opts,
        previousRawValue: prevValue,
        rawValue: this.value_,
        sender: this
      });
    }
  };
  var ReadonlyPrimitiveValue = class {
    constructor(value) {
      this.emitter = new Emitter();
      this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this);
      this.onValueChange_ = this.onValueChange_.bind(this);
      this.value_ = value;
      this.value_.emitter.on("beforechange", this.onValueBeforeChange_);
      this.value_.emitter.on("change", this.onValueChange_);
    }
    get rawValue() {
      return this.value_.rawValue;
    }
    onValueBeforeChange_(ev) {
      this.emitter.emit("beforechange", Object.assign(Object.assign({}, ev), { sender: this }));
    }
    onValueChange_(ev) {
      this.emitter.emit("change", Object.assign(Object.assign({}, ev), { sender: this }));
    }
  };
  function createValue(initialValue, config) {
    const constraint = config === null || config === void 0 ? void 0 : config.constraint;
    const equals = config === null || config === void 0 ? void 0 : config.equals;
    if (!constraint && !equals) {
      return new PrimitiveValue(initialValue);
    }
    return new ComplexValue(initialValue, config);
  }
  function createReadonlyValue(value) {
    return [
      new ReadonlyPrimitiveValue(value),
      (rawValue, options) => {
        value.setRawValue(rawValue, options);
      }
    ];
  }
  var ValueMap = class {
    constructor(valueMap) {
      this.emitter = new Emitter();
      this.valMap_ = valueMap;
      for (const key in this.valMap_) {
        const v2 = this.valMap_[key];
        v2.emitter.on("change", () => {
          this.emitter.emit("change", {
            key,
            sender: this
          });
        });
      }
    }
    static createCore(initialValue) {
      const keys = Object.keys(initialValue);
      return keys.reduce((o, key) => {
        return Object.assign(o, {
          [key]: createValue(initialValue[key])
        });
      }, {});
    }
    static fromObject(initialValue) {
      const core = this.createCore(initialValue);
      return new ValueMap(core);
    }
    get(key) {
      return this.valMap_[key].rawValue;
    }
    set(key, value) {
      this.valMap_[key].rawValue = value;
    }
    value(key) {
      return this.valMap_[key];
    }
  };
  var DefiniteRangeConstraint = class {
    constructor(config) {
      this.values = ValueMap.fromObject({
        max: config.max,
        min: config.min
      });
    }
    constrain(value) {
      const max = this.values.get("max");
      const min = this.values.get("min");
      return Math.min(Math.max(value, min), max);
    }
  };
  var RangeConstraint = class {
    constructor(config) {
      this.values = ValueMap.fromObject({
        max: config.max,
        min: config.min
      });
    }
    constrain(value) {
      const max = this.values.get("max");
      const min = this.values.get("min");
      let result = value;
      if (!isEmpty(min)) {
        result = Math.max(result, min);
      }
      if (!isEmpty(max)) {
        result = Math.min(result, max);
      }
      return result;
    }
  };
  var StepConstraint = class {
    constructor(step, origin = 0) {
      this.step = step;
      this.origin = origin;
    }
    constrain(value) {
      const o = this.origin % this.step;
      const r = Math.round((value - o) / this.step);
      return o + r * this.step;
    }
  };
  var NumberLiteralNode = class {
    constructor(text) {
      this.text = text;
    }
    evaluate() {
      return Number(this.text);
    }
    toString() {
      return this.text;
    }
  };
  var BINARY_OPERATION_MAP = {
    "**": (v1, v2) => Math.pow(v1, v2),
    "*": (v1, v2) => v1 * v2,
    "/": (v1, v2) => v1 / v2,
    "%": (v1, v2) => v1 % v2,
    "+": (v1, v2) => v1 + v2,
    "-": (v1, v2) => v1 - v2,
    "<<": (v1, v2) => v1 << v2,
    ">>": (v1, v2) => v1 >> v2,
    ">>>": (v1, v2) => v1 >>> v2,
    "&": (v1, v2) => v1 & v2,
    "^": (v1, v2) => v1 ^ v2,
    "|": (v1, v2) => v1 | v2
  };
  var BinaryOperationNode = class {
    constructor(operator, left, right) {
      this.left = left;
      this.operator = operator;
      this.right = right;
    }
    evaluate() {
      const op = BINARY_OPERATION_MAP[this.operator];
      if (!op) {
        throw new Error(`unexpected binary operator: '${this.operator}`);
      }
      return op(this.left.evaluate(), this.right.evaluate());
    }
    toString() {
      return [
        "b(",
        this.left.toString(),
        this.operator,
        this.right.toString(),
        ")"
      ].join(" ");
    }
  };
  var UNARY_OPERATION_MAP = {
    "+": (v2) => v2,
    "-": (v2) => -v2,
    "~": (v2) => ~v2
  };
  var UnaryOperationNode = class {
    constructor(operator, expr) {
      this.operator = operator;
      this.expression = expr;
    }
    evaluate() {
      const op = UNARY_OPERATION_MAP[this.operator];
      if (!op) {
        throw new Error(`unexpected unary operator: '${this.operator}`);
      }
      return op(this.expression.evaluate());
    }
    toString() {
      return ["u(", this.operator, this.expression.toString(), ")"].join(" ");
    }
  };
  function combineReader(parsers) {
    return (text, cursor) => {
      for (let i = 0; i < parsers.length; i++) {
        const result = parsers[i](text, cursor);
        if (result !== "") {
          return result;
        }
      }
      return "";
    };
  }
  function readWhitespace(text, cursor) {
    var _a;
    const m2 = text.substr(cursor).match(/^\s+/);
    return (_a = m2 && m2[0]) !== null && _a !== void 0 ? _a : "";
  }
  function readNonZeroDigit(text, cursor) {
    const ch = text.substr(cursor, 1);
    return ch.match(/^[1-9]$/) ? ch : "";
  }
  function readDecimalDigits(text, cursor) {
    var _a;
    const m2 = text.substr(cursor).match(/^[0-9]+/);
    return (_a = m2 && m2[0]) !== null && _a !== void 0 ? _a : "";
  }
  function readSignedInteger(text, cursor) {
    const ds = readDecimalDigits(text, cursor);
    if (ds !== "") {
      return ds;
    }
    const sign = text.substr(cursor, 1);
    cursor += 1;
    if (sign !== "-" && sign !== "+") {
      return "";
    }
    const sds = readDecimalDigits(text, cursor);
    if (sds === "") {
      return "";
    }
    return sign + sds;
  }
  function readExponentPart(text, cursor) {
    const e = text.substr(cursor, 1);
    cursor += 1;
    if (e.toLowerCase() !== "e") {
      return "";
    }
    const si = readSignedInteger(text, cursor);
    if (si === "") {
      return "";
    }
    return e + si;
  }
  function readDecimalIntegerLiteral(text, cursor) {
    const ch = text.substr(cursor, 1);
    if (ch === "0") {
      return ch;
    }
    const nzd = readNonZeroDigit(text, cursor);
    cursor += nzd.length;
    if (nzd === "") {
      return "";
    }
    return nzd + readDecimalDigits(text, cursor);
  }
  function readDecimalLiteral1(text, cursor) {
    const dil = readDecimalIntegerLiteral(text, cursor);
    cursor += dil.length;
    if (dil === "") {
      return "";
    }
    const dot = text.substr(cursor, 1);
    cursor += dot.length;
    if (dot !== ".") {
      return "";
    }
    const dds = readDecimalDigits(text, cursor);
    cursor += dds.length;
    return dil + dot + dds + readExponentPart(text, cursor);
  }
  function readDecimalLiteral2(text, cursor) {
    const dot = text.substr(cursor, 1);
    cursor += dot.length;
    if (dot !== ".") {
      return "";
    }
    const dds = readDecimalDigits(text, cursor);
    cursor += dds.length;
    if (dds === "") {
      return "";
    }
    return dot + dds + readExponentPart(text, cursor);
  }
  function readDecimalLiteral3(text, cursor) {
    const dil = readDecimalIntegerLiteral(text, cursor);
    cursor += dil.length;
    if (dil === "") {
      return "";
    }
    return dil + readExponentPart(text, cursor);
  }
  var readDecimalLiteral = combineReader([
    readDecimalLiteral1,
    readDecimalLiteral2,
    readDecimalLiteral3
  ]);
  function parseBinaryDigits(text, cursor) {
    var _a;
    const m2 = text.substr(cursor).match(/^[01]+/);
    return (_a = m2 && m2[0]) !== null && _a !== void 0 ? _a : "";
  }
  function readBinaryIntegerLiteral(text, cursor) {
    const prefix = text.substr(cursor, 2);
    cursor += prefix.length;
    if (prefix.toLowerCase() !== "0b") {
      return "";
    }
    const bds = parseBinaryDigits(text, cursor);
    if (bds === "") {
      return "";
    }
    return prefix + bds;
  }
  function readOctalDigits(text, cursor) {
    var _a;
    const m2 = text.substr(cursor).match(/^[0-7]+/);
    return (_a = m2 && m2[0]) !== null && _a !== void 0 ? _a : "";
  }
  function readOctalIntegerLiteral(text, cursor) {
    const prefix = text.substr(cursor, 2);
    cursor += prefix.length;
    if (prefix.toLowerCase() !== "0o") {
      return "";
    }
    const ods = readOctalDigits(text, cursor);
    if (ods === "") {
      return "";
    }
    return prefix + ods;
  }
  function readHexDigits(text, cursor) {
    var _a;
    const m2 = text.substr(cursor).match(/^[0-9a-f]+/i);
    return (_a = m2 && m2[0]) !== null && _a !== void 0 ? _a : "";
  }
  function readHexIntegerLiteral(text, cursor) {
    const prefix = text.substr(cursor, 2);
    cursor += prefix.length;
    if (prefix.toLowerCase() !== "0x") {
      return "";
    }
    const hds = readHexDigits(text, cursor);
    if (hds === "") {
      return "";
    }
    return prefix + hds;
  }
  var readNonDecimalIntegerLiteral = combineReader([
    readBinaryIntegerLiteral,
    readOctalIntegerLiteral,
    readHexIntegerLiteral
  ]);
  var readNumericLiteral = combineReader([
    readNonDecimalIntegerLiteral,
    readDecimalLiteral
  ]);
  function parseLiteral(text, cursor) {
    const num = readNumericLiteral(text, cursor);
    cursor += num.length;
    if (num === "") {
      return null;
    }
    return {
      evaluable: new NumberLiteralNode(num),
      cursor
    };
  }
  function parseParenthesizedExpression(text, cursor) {
    const op = text.substr(cursor, 1);
    cursor += op.length;
    if (op !== "(") {
      return null;
    }
    const expr = parseExpression(text, cursor);
    if (!expr) {
      return null;
    }
    cursor = expr.cursor;
    cursor += readWhitespace(text, cursor).length;
    const cl = text.substr(cursor, 1);
    cursor += cl.length;
    if (cl !== ")") {
      return null;
    }
    return {
      evaluable: expr.evaluable,
      cursor
    };
  }
  function parsePrimaryExpression(text, cursor) {
    var _a;
    return (_a = parseLiteral(text, cursor)) !== null && _a !== void 0 ? _a : parseParenthesizedExpression(text, cursor);
  }
  function parseUnaryExpression(text, cursor) {
    const expr = parsePrimaryExpression(text, cursor);
    if (expr) {
      return expr;
    }
    const op = text.substr(cursor, 1);
    cursor += op.length;
    if (op !== "+" && op !== "-" && op !== "~") {
      return null;
    }
    const num = parseUnaryExpression(text, cursor);
    if (!num) {
      return null;
    }
    cursor = num.cursor;
    return {
      cursor,
      evaluable: new UnaryOperationNode(op, num.evaluable)
    };
  }
  function readBinaryOperator(ops, text, cursor) {
    cursor += readWhitespace(text, cursor).length;
    const op = ops.filter((op2) => text.startsWith(op2, cursor))[0];
    if (!op) {
      return null;
    }
    cursor += op.length;
    cursor += readWhitespace(text, cursor).length;
    return {
      cursor,
      operator: op
    };
  }
  function createBinaryOperationExpressionParser(exprParser, ops) {
    return (text, cursor) => {
      const firstExpr = exprParser(text, cursor);
      if (!firstExpr) {
        return null;
      }
      cursor = firstExpr.cursor;
      let expr = firstExpr.evaluable;
      for (; ; ) {
        const op = readBinaryOperator(ops, text, cursor);
        if (!op) {
          break;
        }
        cursor = op.cursor;
        const nextExpr = exprParser(text, cursor);
        if (!nextExpr) {
          return null;
        }
        cursor = nextExpr.cursor;
        expr = new BinaryOperationNode(op.operator, expr, nextExpr.evaluable);
      }
      return expr ? {
        cursor,
        evaluable: expr
      } : null;
    };
  }
  var parseBinaryOperationExpression = [
    ["**"],
    ["*", "/", "%"],
    ["+", "-"],
    ["<<", ">>>", ">>"],
    ["&"],
    ["^"],
    ["|"]
  ].reduce((parser, ops) => {
    return createBinaryOperationExpressionParser(parser, ops);
  }, parseUnaryExpression);
  function parseExpression(text, cursor) {
    cursor += readWhitespace(text, cursor).length;
    return parseBinaryOperationExpression(text, cursor);
  }
  function parseEcmaNumberExpression(text) {
    const expr = parseExpression(text, 0);
    if (!expr) {
      return null;
    }
    const cursor = expr.cursor + readWhitespace(text, expr.cursor).length;
    if (cursor !== text.length) {
      return null;
    }
    return expr.evaluable;
  }
  function parseNumber(text) {
    var _a;
    const r = parseEcmaNumberExpression(text);
    return (_a = r === null || r === void 0 ? void 0 : r.evaluate()) !== null && _a !== void 0 ? _a : null;
  }
  function numberFromUnknown(value) {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const pv = parseNumber(value);
      if (!isEmpty(pv)) {
        return pv;
      }
    }
    return 0;
  }
  function createNumberFormatter(digits) {
    return (value) => {
      return value.toFixed(Math.max(Math.min(digits, 20), 0));
    };
  }
  function mapRange(value, start1, end1, start2, end2) {
    const p2 = (value - start1) / (end1 - start1);
    return start2 + p2 * (end2 - start2);
  }
  function getDecimalDigits(value) {
    const text = String(value.toFixed(10));
    const frac = text.split(".")[1];
    return frac.replace(/0+$/, "").length;
  }
  function constrainRange(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  function loopRange(value, max) {
    return (value % max + max) % max;
  }
  function getSuitableDecimalDigits(params, rawValue) {
    return !isEmpty(params.step) ? getDecimalDigits(params.step) : Math.max(getDecimalDigits(rawValue), 2);
  }
  function getSuitableKeyScale(params) {
    var _a;
    return (_a = params.step) !== null && _a !== void 0 ? _a : 1;
  }
  function getSuitablePointerScale(params, rawValue) {
    var _a;
    const base = Math.abs((_a = params.step) !== null && _a !== void 0 ? _a : rawValue);
    return base === 0 ? 0.1 : Math.pow(10, Math.floor(Math.log10(base)) - 1);
  }
  function createStepConstraint(params, initialValue) {
    if (!isEmpty(params.step)) {
      return new StepConstraint(params.step, initialValue);
    }
    return null;
  }
  function createRangeConstraint(params) {
    if (!isEmpty(params.max) && !isEmpty(params.min)) {
      return new DefiniteRangeConstraint({
        max: params.max,
        min: params.min
      });
    }
    if (!isEmpty(params.max) || !isEmpty(params.min)) {
      return new RangeConstraint({
        max: params.max,
        min: params.min
      });
    }
    return null;
  }
  function createNumberTextPropsObject(params, initialValue) {
    var _a, _b, _c;
    return {
      formatter: (_a = params.format) !== null && _a !== void 0 ? _a : createNumberFormatter(getSuitableDecimalDigits(params, initialValue)),
      keyScale: (_b = params.keyScale) !== null && _b !== void 0 ? _b : getSuitableKeyScale(params),
      pointerScale: (_c = params.pointerScale) !== null && _c !== void 0 ? _c : getSuitablePointerScale(params, initialValue)
    };
  }
  function createNumberTextInputParamsParser(p2) {
    return {
      format: p2.optional.function,
      keyScale: p2.optional.number,
      max: p2.optional.number,
      min: p2.optional.number,
      pointerScale: p2.optional.number,
      step: p2.optional.number
    };
  }
  function createPointAxis(config) {
    return {
      constraint: config.constraint,
      textProps: ValueMap.fromObject(createNumberTextPropsObject(config.params, config.initialValue))
    };
  }
  var BladeApi = class {
    constructor(controller) {
      this.controller = controller;
    }
    get element() {
      return this.controller.view.element;
    }
    get disabled() {
      return this.controller.viewProps.get("disabled");
    }
    set disabled(disabled) {
      this.controller.viewProps.set("disabled", disabled);
    }
    get hidden() {
      return this.controller.viewProps.get("hidden");
    }
    set hidden(hidden) {
      this.controller.viewProps.set("hidden", hidden);
    }
    dispose() {
      this.controller.viewProps.set("disposed", true);
    }
    importState(state) {
      return this.controller.importState(state);
    }
    exportState() {
      return this.controller.exportState();
    }
  };
  var TpEvent = class {
    constructor(target2) {
      this.target = target2;
    }
  };
  var TpChangeEvent = class extends TpEvent {
    constructor(target2, value, last) {
      super(target2);
      this.value = value;
      this.last = last !== null && last !== void 0 ? last : true;
    }
  };
  var TpFoldEvent = class extends TpEvent {
    constructor(target2, expanded) {
      super(target2);
      this.expanded = expanded;
    }
  };
  var TpTabSelectEvent = class extends TpEvent {
    constructor(target2, index) {
      super(target2);
      this.index = index;
    }
  };
  var BindingApi = class extends BladeApi {
    constructor(controller) {
      super(controller);
      this.onValueChange_ = this.onValueChange_.bind(this);
      this.emitter_ = new Emitter();
      this.controller.value.emitter.on("change", this.onValueChange_);
    }
    get label() {
      return this.controller.labelController.props.get("label");
    }
    set label(label) {
      this.controller.labelController.props.set("label", label);
    }
    get key() {
      return this.controller.value.binding.target.key;
    }
    get tag() {
      return this.controller.tag;
    }
    set tag(tag) {
      this.controller.tag = tag;
    }
    on(eventName, handler) {
      const bh = handler.bind(this);
      this.emitter_.on(eventName, (ev) => {
        bh(ev);
      });
      return this;
    }
    refresh() {
      this.controller.value.fetch();
    }
    onValueChange_(ev) {
      const value = this.controller.value;
      this.emitter_.emit("change", new TpChangeEvent(this, forceCast(value.binding.target.read()), ev.options.last));
    }
  };
  function parseObject(value, keyToParserMap) {
    const keys = Object.keys(keyToParserMap);
    const result = keys.reduce((tmp, key) => {
      if (tmp === void 0) {
        return void 0;
      }
      const parser = keyToParserMap[key];
      const result2 = parser(value[key]);
      return result2.succeeded ? Object.assign(Object.assign({}, tmp), { [key]: result2.value }) : void 0;
    }, {});
    return forceCast(result);
  }
  function parseArray(value, parseItem) {
    return value.reduce((tmp, item) => {
      if (tmp === void 0) {
        return void 0;
      }
      const result = parseItem(item);
      if (!result.succeeded || result.value === void 0) {
        return void 0;
      }
      return [...tmp, result.value];
    }, []);
  }
  function isObject2(value) {
    if (value === null) {
      return false;
    }
    return typeof value === "object";
  }
  function createMicroParserBuilder(parse) {
    return (optional) => (v2) => {
      if (!optional && v2 === void 0) {
        return {
          succeeded: false,
          value: void 0
        };
      }
      if (optional && v2 === void 0) {
        return {
          succeeded: true,
          value: void 0
        };
      }
      const result = parse(v2);
      return result !== void 0 ? {
        succeeded: true,
        value: result
      } : {
        succeeded: false,
        value: void 0
      };
    };
  }
  function createMicroParserBuilders(optional) {
    return {
      custom: (parse) => createMicroParserBuilder(parse)(optional),
      boolean: createMicroParserBuilder((v2) => typeof v2 === "boolean" ? v2 : void 0)(optional),
      number: createMicroParserBuilder((v2) => typeof v2 === "number" ? v2 : void 0)(optional),
      string: createMicroParserBuilder((v2) => typeof v2 === "string" ? v2 : void 0)(optional),
      function: createMicroParserBuilder((v2) => typeof v2 === "function" ? v2 : void 0)(optional),
      constant: (value) => createMicroParserBuilder((v2) => v2 === value ? value : void 0)(optional),
      raw: createMicroParserBuilder((v2) => v2)(optional),
      object: (keyToParserMap) => createMicroParserBuilder((v2) => {
        if (!isObject2(v2)) {
          return void 0;
        }
        return parseObject(v2, keyToParserMap);
      })(optional),
      array: (itemParser) => createMicroParserBuilder((v2) => {
        if (!Array.isArray(v2)) {
          return void 0;
        }
        return parseArray(v2, itemParser);
      })(optional)
    };
  }
  var MicroParsers = {
    optional: createMicroParserBuilders(true),
    required: createMicroParserBuilders(false)
  };
  function parseRecord(value, keyToParserMap) {
    const map = keyToParserMap(MicroParsers);
    const result = MicroParsers.required.object(map)(value);
    return result.succeeded ? result.value : void 0;
  }
  function importBladeState(state, superImport, parser, callback) {
    if (superImport && !superImport(state)) {
      return false;
    }
    const result = parseRecord(state, parser);
    return result ? callback(result) : false;
  }
  function exportBladeState(superExport, thisState) {
    var _a;
    return deepMerge((_a = superExport === null || superExport === void 0 ? void 0 : superExport()) !== null && _a !== void 0 ? _a : {}, thisState);
  }
  function isValueBladeController(bc) {
    return "value" in bc;
  }
  function isBindingValue(v2) {
    if (!isObject$1(v2) || !("binding" in v2)) {
      return false;
    }
    const b2 = v2.binding;
    return isBinding(b2);
  }
  var SVG_NS = "http://www.w3.org/2000/svg";
  function forceReflow(element) {
    element.offsetHeight;
  }
  function disableTransitionTemporarily(element, callback) {
    const t = element.style.transition;
    element.style.transition = "none";
    callback();
    element.style.transition = t;
  }
  function supportsTouch(doc) {
    return doc.ontouchstart !== void 0;
  }
  function getCanvasContext(canvasElement) {
    const win = canvasElement.ownerDocument.defaultView;
    if (!win) {
      return null;
    }
    const isBrowser = "document" in win;
    return isBrowser ? canvasElement.getContext("2d", {
      willReadFrequently: true
    }) : null;
  }
  var ICON_ID_TO_INNER_HTML_MAP = {
    check: '<path d="M2 8l4 4l8 -8"/>',
    dropdown: '<path d="M5 7h6l-3 3 z"/>',
    p2dpad: '<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>'
  };
  function createSvgIconElement(document2, iconId) {
    const elem = document2.createElementNS(SVG_NS, "svg");
    elem.innerHTML = ICON_ID_TO_INNER_HTML_MAP[iconId];
    return elem;
  }
  function insertElementAt(parentElement, element, index) {
    parentElement.insertBefore(element, parentElement.children[index]);
  }
  function removeElement(element) {
    if (element.parentElement) {
      element.parentElement.removeChild(element);
    }
  }
  function removeChildElements(element) {
    while (element.children.length > 0) {
      element.removeChild(element.children[0]);
    }
  }
  function removeChildNodes(element) {
    while (element.childNodes.length > 0) {
      element.removeChild(element.childNodes[0]);
    }
  }
  function findNextTarget(ev) {
    if (ev.relatedTarget) {
      return forceCast(ev.relatedTarget);
    }
    if ("explicitOriginalTarget" in ev) {
      return ev.explicitOriginalTarget;
    }
    return null;
  }
  function bindValue(value, applyValue) {
    value.emitter.on("change", (ev) => {
      applyValue(ev.rawValue);
    });
    applyValue(value.rawValue);
  }
  function bindValueMap(valueMap, key, applyValue) {
    bindValue(valueMap.value(key), applyValue);
  }
  var PREFIX = "tp";
  function ClassName(viewName) {
    const fn = (opt_elementName, opt_modifier) => {
      return [
        PREFIX,
        "-",
        viewName,
        "v",
        opt_elementName ? `_${opt_elementName}` : "",
        opt_modifier ? `-${opt_modifier}` : ""
      ].join("");
    };
    return fn;
  }
  var cn$r = ClassName("lbl");
  function createLabelNode(doc, label) {
    const frag = doc.createDocumentFragment();
    const lineNodes = label.split("\n").map((line) => {
      return doc.createTextNode(line);
    });
    lineNodes.forEach((lineNode, index) => {
      if (index > 0) {
        frag.appendChild(doc.createElement("br"));
      }
      frag.appendChild(lineNode);
    });
    return frag;
  }
  var LabelView = class {
    constructor(doc, config) {
      this.element = doc.createElement("div");
      this.element.classList.add(cn$r());
      config.viewProps.bindClassModifiers(this.element);
      const labelElem = doc.createElement("div");
      labelElem.classList.add(cn$r("l"));
      bindValueMap(config.props, "label", (value) => {
        if (isEmpty(value)) {
          this.element.classList.add(cn$r(void 0, "nol"));
        } else {
          this.element.classList.remove(cn$r(void 0, "nol"));
          removeChildNodes(labelElem);
          labelElem.appendChild(createLabelNode(doc, value));
        }
      });
      this.element.appendChild(labelElem);
      this.labelElement = labelElem;
      const valueElem = doc.createElement("div");
      valueElem.classList.add(cn$r("v"));
      this.element.appendChild(valueElem);
      this.valueElement = valueElem;
    }
  };
  var LabelController = class {
    constructor(doc, config) {
      this.props = config.props;
      this.valueController = config.valueController;
      this.viewProps = config.valueController.viewProps;
      this.view = new LabelView(doc, {
        props: config.props,
        viewProps: this.viewProps
      });
      this.view.valueElement.appendChild(this.valueController.view.element);
    }
    importProps(state) {
      return importBladeState(state, null, (p2) => ({
        label: p2.optional.string
      }), (result) => {
        this.props.set("label", result.label);
        return true;
      });
    }
    exportProps() {
      return exportBladeState(null, {
        label: this.props.get("label")
      });
    }
  };
  function getAllBladePositions() {
    return ["veryfirst", "first", "last", "verylast"];
  }
  var cn$q = ClassName("");
  var POS_TO_CLASS_NAME_MAP = {
    veryfirst: "vfst",
    first: "fst",
    last: "lst",
    verylast: "vlst"
  };
  var BladeController = class {
    constructor(config) {
      this.parent_ = null;
      this.blade = config.blade;
      this.view = config.view;
      this.viewProps = config.viewProps;
      const elem = this.view.element;
      this.blade.value("positions").emitter.on("change", () => {
        getAllBladePositions().forEach((pos) => {
          elem.classList.remove(cn$q(void 0, POS_TO_CLASS_NAME_MAP[pos]));
        });
        this.blade.get("positions").forEach((pos) => {
          elem.classList.add(cn$q(void 0, POS_TO_CLASS_NAME_MAP[pos]));
        });
      });
      this.viewProps.handleDispose(() => {
        removeElement(elem);
      });
    }
    get parent() {
      return this.parent_;
    }
    set parent(parent) {
      this.parent_ = parent;
      this.viewProps.set("parent", this.parent_ ? this.parent_.viewProps : null);
    }
    importState(state) {
      return importBladeState(state, null, (p2) => ({
        disabled: p2.required.boolean,
        hidden: p2.required.boolean
      }), (result) => {
        this.viewProps.importState(result);
        return true;
      });
    }
    exportState() {
      return exportBladeState(null, Object.assign({}, this.viewProps.exportState()));
    }
  };
  var LabeledValueBladeController = class extends BladeController {
    constructor(doc, config) {
      if (config.value !== config.valueController.value) {
        throw TpError.shouldNeverHappen();
      }
      const viewProps = config.valueController.viewProps;
      const lc = new LabelController(doc, {
        blade: config.blade,
        props: config.props,
        valueController: config.valueController
      });
      super(Object.assign(Object.assign({}, config), { view: new LabelView(doc, {
        props: config.props,
        viewProps
      }), viewProps }));
      this.labelController = lc;
      this.value = config.value;
      this.valueController = config.valueController;
      this.view.valueElement.appendChild(this.valueController.view.element);
    }
    importState(state) {
      return importBladeState(state, (s) => {
        var _a, _b, _c;
        return super.importState(s) && this.labelController.importProps(s) && ((_c = (_b = (_a = this.valueController).importProps) === null || _b === void 0 ? void 0 : _b.call(_a, state)) !== null && _c !== void 0 ? _c : true);
      }, (p2) => ({
        value: p2.optional.raw
      }), (result) => {
        if (result.value) {
          this.value.rawValue = result.value;
        }
        return true;
      });
    }
    exportState() {
      var _a, _b, _c;
      return exportBladeState(() => super.exportState(), Object.assign(Object.assign({ value: this.value.rawValue }, this.labelController.exportProps()), (_c = (_b = (_a = this.valueController).exportProps) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : {}));
    }
  };
  var ButtonApi = class extends BladeApi {
    get label() {
      return this.controller.labelController.props.get("label");
    }
    set label(label) {
      this.controller.labelController.props.set("label", label);
    }
    get title() {
      var _a;
      return (_a = this.controller.buttonController.props.get("title")) !== null && _a !== void 0 ? _a : "";
    }
    set title(title) {
      this.controller.buttonController.props.set("title", title);
    }
    on(eventName, handler) {
      const bh = handler.bind(this);
      const emitter = this.controller.buttonController.emitter;
      emitter.on(eventName, () => {
        bh(new TpEvent(this));
      });
      return this;
    }
  };
  function applyClass(elem, className, active) {
    if (active) {
      elem.classList.add(className);
    } else {
      elem.classList.remove(className);
    }
  }
  function valueToClassName(elem, className) {
    return (value) => {
      applyClass(elem, className, value);
    };
  }
  function bindValueToTextContent(value, elem) {
    bindValue(value, (text) => {
      elem.textContent = text !== null && text !== void 0 ? text : "";
    });
  }
  var cn$p = ClassName("btn");
  var ButtonView = class {
    constructor(doc, config) {
      this.element = doc.createElement("div");
      this.element.classList.add(cn$p());
      config.viewProps.bindClassModifiers(this.element);
      const buttonElem = doc.createElement("button");
      buttonElem.classList.add(cn$p("b"));
      config.viewProps.bindDisabled(buttonElem);
      this.element.appendChild(buttonElem);
      this.buttonElement = buttonElem;
      const titleElem = doc.createElement("div");
      titleElem.classList.add(cn$p("t"));
      bindValueToTextContent(config.props.value("title"), titleElem);
      this.buttonElement.appendChild(titleElem);
    }
  };
  var ButtonController = class {
    constructor(doc, config) {
      this.emitter = new Emitter();
      this.onClick_ = this.onClick_.bind(this);
      this.props = config.props;
      this.viewProps = config.viewProps;
      this.view = new ButtonView(doc, {
        props: this.props,
        viewProps: this.viewProps
      });
      this.view.buttonElement.addEventListener("click", this.onClick_);
    }
    importProps(state) {
      return importBladeState(state, null, (p2) => ({
        title: p2.optional.string
      }), (result) => {
        this.props.set("title", result.title);
        return true;
      });
    }
    exportProps() {
      return exportBladeState(null, {
        title: this.props.get("title")
      });
    }
    onClick_() {
      this.emitter.emit("click", {
        sender: this
      });
    }
  };
  var ButtonBladeController = class extends BladeController {
    constructor(doc, config) {
      const bc = new ButtonController(doc, {
        props: config.buttonProps,
        viewProps: config.viewProps
      });
      const lc = new LabelController(doc, {
        blade: config.blade,
        props: config.labelProps,
        valueController: bc
      });
      super({
        blade: config.blade,
        view: lc.view,
        viewProps: config.viewProps
      });
      this.buttonController = bc;
      this.labelController = lc;
    }
    importState(state) {
      return importBladeState(state, (s) => super.importState(s) && this.buttonController.importProps(s) && this.labelController.importProps(s), () => ({}), () => true);
    }
    exportState() {
      return exportBladeState(() => super.exportState(), Object.assign(Object.assign({}, this.buttonController.exportProps()), this.labelController.exportProps()));
    }
  };
  var Semver = class {
    constructor(text) {
      const [core, prerelease] = text.split("-");
      const coreComps = core.split(".");
      this.major = parseInt(coreComps[0], 10);
      this.minor = parseInt(coreComps[1], 10);
      this.patch = parseInt(coreComps[2], 10);
      this.prerelease = prerelease !== null && prerelease !== void 0 ? prerelease : null;
    }
    toString() {
      const core = [this.major, this.minor, this.patch].join(".");
      return this.prerelease !== null ? [core, this.prerelease].join("-") : core;
    }
  };
  var VERSION$1 = new Semver("2.0.1");
  function createPlugin(plugin) {
    return Object.assign({ core: VERSION$1 }, plugin);
  }
  var ButtonBladePlugin = createPlugin({
    id: "button",
    type: "blade",
    accept(params) {
      const result = parseRecord(params, (p2) => ({
        title: p2.required.string,
        view: p2.required.constant("button"),
        label: p2.optional.string
      }));
      return result ? { params: result } : null;
    },
    controller(args) {
      return new ButtonBladeController(args.document, {
        blade: args.blade,
        buttonProps: ValueMap.fromObject({
          title: args.params.title
        }),
        labelProps: ValueMap.fromObject({
          label: args.params.label
        }),
        viewProps: args.viewProps
      });
    },
    api(args) {
      if (args.controller instanceof ButtonBladeController) {
        return new ButtonApi(args.controller);
      }
      return null;
    }
  });
  function addButtonAsBlade(api, params) {
    return api.addBlade(Object.assign(Object.assign({}, params), { view: "button" }));
  }
  function addFolderAsBlade(api, params) {
    return api.addBlade(Object.assign(Object.assign({}, params), { view: "folder" }));
  }
  function addTabAsBlade(api, params) {
    return api.addBlade(Object.assign(Object.assign({}, params), { view: "tab" }));
  }
  function isRefreshable(value) {
    if (!isObject$1(value)) {
      return false;
    }
    return "refresh" in value && typeof value.refresh === "function";
  }
  function createBindingTarget(obj, key) {
    if (!BindingTarget.isBindable(obj)) {
      throw TpError.notBindable();
    }
    return new BindingTarget(obj, key);
  }
  var RackApi = class {
    constructor(controller, pool) {
      this.onRackValueChange_ = this.onRackValueChange_.bind(this);
      this.controller_ = controller;
      this.emitter_ = new Emitter();
      this.pool_ = pool;
      const rack = this.controller_.rack;
      rack.emitter.on("valuechange", this.onRackValueChange_);
    }
    get children() {
      return this.controller_.rack.children.map((bc) => this.pool_.createApi(bc));
    }
    addBinding(object, key, opt_params) {
      const params = opt_params !== null && opt_params !== void 0 ? opt_params : {};
      const doc = this.controller_.element.ownerDocument;
      const bc = this.pool_.createBinding(doc, createBindingTarget(object, key), params);
      const api = this.pool_.createBindingApi(bc);
      return this.add(api, params.index);
    }
    addFolder(params) {
      return addFolderAsBlade(this, params);
    }
    addButton(params) {
      return addButtonAsBlade(this, params);
    }
    addTab(params) {
      return addTabAsBlade(this, params);
    }
    add(api, opt_index) {
      const bc = api.controller;
      this.controller_.rack.add(bc, opt_index);
      return api;
    }
    remove(api) {
      this.controller_.rack.remove(api.controller);
    }
    addBlade(params) {
      const doc = this.controller_.element.ownerDocument;
      const bc = this.pool_.createBlade(doc, params);
      const api = this.pool_.createApi(bc);
      return this.add(api, params.index);
    }
    on(eventName, handler) {
      const bh = handler.bind(this);
      this.emitter_.on(eventName, (ev) => {
        bh(ev);
      });
      return this;
    }
    refresh() {
      this.children.forEach((c2) => {
        if (isRefreshable(c2)) {
          c2.refresh();
        }
      });
    }
    onRackValueChange_(ev) {
      const bc = ev.bladeController;
      const api = this.pool_.createApi(bc);
      const binding = isBindingValue(bc.value) ? bc.value.binding : null;
      this.emitter_.emit("change", new TpChangeEvent(api, binding ? binding.target.read() : bc.value.rawValue, ev.options.last));
    }
  };
  var ContainerBladeApi = class extends BladeApi {
    constructor(controller, pool) {
      super(controller);
      this.rackApi_ = new RackApi(controller.rackController, pool);
    }
    refresh() {
      this.rackApi_.refresh();
    }
  };
  var ContainerBladeController = class extends BladeController {
    constructor(config) {
      super({
        blade: config.blade,
        view: config.view,
        viewProps: config.rackController.viewProps
      });
      this.rackController = config.rackController;
    }
    importState(state) {
      return importBladeState(state, (s) => super.importState(s), (p2) => ({
        children: p2.required.array(p2.required.raw)
      }), (result) => {
        return this.rackController.rack.children.every((c2, index) => {
          return c2.importState(result.children[index]);
        });
      });
    }
    exportState() {
      return exportBladeState(() => super.exportState(), {
        children: this.rackController.rack.children.map((c2) => c2.exportState())
      });
    }
  };
  function isContainerBladeController(bc) {
    return "rackController" in bc;
  }
  var NestedOrderedSet = class {
    constructor(extract) {
      this.emitter = new Emitter();
      this.items_ = [];
      this.cache_ = /* @__PURE__ */ new Set();
      this.onSubListAdd_ = this.onSubListAdd_.bind(this);
      this.onSubListRemove_ = this.onSubListRemove_.bind(this);
      this.extract_ = extract;
    }
    get items() {
      return this.items_;
    }
    allItems() {
      return Array.from(this.cache_);
    }
    find(callback) {
      for (const item of this.allItems()) {
        if (callback(item)) {
          return item;
        }
      }
      return null;
    }
    includes(item) {
      return this.cache_.has(item);
    }
    add(item, opt_index) {
      if (this.includes(item)) {
        throw TpError.shouldNeverHappen();
      }
      const index = opt_index !== void 0 ? opt_index : this.items_.length;
      this.items_.splice(index, 0, item);
      this.cache_.add(item);
      const subList = this.extract_(item);
      if (subList) {
        subList.emitter.on("add", this.onSubListAdd_);
        subList.emitter.on("remove", this.onSubListRemove_);
        subList.allItems().forEach((i) => {
          this.cache_.add(i);
        });
      }
      this.emitter.emit("add", {
        index,
        item,
        root: this,
        target: this
      });
    }
    remove(item) {
      const index = this.items_.indexOf(item);
      if (index < 0) {
        return;
      }
      this.items_.splice(index, 1);
      this.cache_.delete(item);
      const subList = this.extract_(item);
      if (subList) {
        subList.allItems().forEach((i) => {
          this.cache_.delete(i);
        });
        subList.emitter.off("add", this.onSubListAdd_);
        subList.emitter.off("remove", this.onSubListRemove_);
      }
      this.emitter.emit("remove", {
        index,
        item,
        root: this,
        target: this
      });
    }
    onSubListAdd_(ev) {
      this.cache_.add(ev.item);
      this.emitter.emit("add", {
        index: ev.index,
        item: ev.item,
        root: this,
        target: ev.target
      });
    }
    onSubListRemove_(ev) {
      this.cache_.delete(ev.item);
      this.emitter.emit("remove", {
        index: ev.index,
        item: ev.item,
        root: this,
        target: ev.target
      });
    }
  };
  function findValueBladeController(bcs, v2) {
    for (let i = 0; i < bcs.length; i++) {
      const bc = bcs[i];
      if (isValueBladeController(bc) && bc.value === v2) {
        return bc;
      }
    }
    return null;
  }
  function findSubBladeControllerSet(bc) {
    return isContainerBladeController(bc) ? bc.rackController.rack["bcSet_"] : null;
  }
  var Rack = class {
    constructor(config) {
      var _a, _b;
      this.emitter = new Emitter();
      this.onBladePositionsChange_ = this.onBladePositionsChange_.bind(this);
      this.onSetAdd_ = this.onSetAdd_.bind(this);
      this.onSetRemove_ = this.onSetRemove_.bind(this);
      this.onChildDispose_ = this.onChildDispose_.bind(this);
      this.onChildPositionsChange_ = this.onChildPositionsChange_.bind(this);
      this.onChildValueChange_ = this.onChildValueChange_.bind(this);
      this.onChildViewPropsChange_ = this.onChildViewPropsChange_.bind(this);
      this.onRackLayout_ = this.onRackLayout_.bind(this);
      this.onRackValueChange_ = this.onRackValueChange_.bind(this);
      this.blade_ = (_a = config.blade) !== null && _a !== void 0 ? _a : null;
      (_b = this.blade_) === null || _b === void 0 ? void 0 : _b.value("positions").emitter.on("change", this.onBladePositionsChange_);
      this.viewProps = config.viewProps;
      this.bcSet_ = new NestedOrderedSet(findSubBladeControllerSet);
      this.bcSet_.emitter.on("add", this.onSetAdd_);
      this.bcSet_.emitter.on("remove", this.onSetRemove_);
    }
    get children() {
      return this.bcSet_.items;
    }
    add(bc, opt_index) {
      var _a;
      (_a = bc.parent) === null || _a === void 0 ? void 0 : _a.remove(bc);
      bc.parent = this;
      this.bcSet_.add(bc, opt_index);
    }
    remove(bc) {
      bc.parent = null;
      this.bcSet_.remove(bc);
    }
    find(finder) {
      return this.bcSet_.allItems().filter(finder);
    }
    onSetAdd_(ev) {
      this.updatePositions_();
      const root = ev.target === ev.root;
      this.emitter.emit("add", {
        bladeController: ev.item,
        index: ev.index,
        root,
        sender: this
      });
      if (!root) {
        return;
      }
      const bc = ev.item;
      bc.viewProps.emitter.on("change", this.onChildViewPropsChange_);
      bc.blade.value("positions").emitter.on("change", this.onChildPositionsChange_);
      bc.viewProps.handleDispose(this.onChildDispose_);
      if (isValueBladeController(bc)) {
        bc.value.emitter.on("change", this.onChildValueChange_);
      } else if (isContainerBladeController(bc)) {
        const rack = bc.rackController.rack;
        if (rack) {
          const emitter = rack.emitter;
          emitter.on("layout", this.onRackLayout_);
          emitter.on("valuechange", this.onRackValueChange_);
        }
      }
    }
    onSetRemove_(ev) {
      this.updatePositions_();
      const root = ev.target === ev.root;
      this.emitter.emit("remove", {
        bladeController: ev.item,
        root,
        sender: this
      });
      if (!root) {
        return;
      }
      const bc = ev.item;
      if (isValueBladeController(bc)) {
        bc.value.emitter.off("change", this.onChildValueChange_);
      } else if (isContainerBladeController(bc)) {
        const rack = bc.rackController.rack;
        if (rack) {
          const emitter = rack.emitter;
          emitter.off("layout", this.onRackLayout_);
          emitter.off("valuechange", this.onRackValueChange_);
        }
      }
    }
    updatePositions_() {
      const visibleItems = this.bcSet_.items.filter((bc) => !bc.viewProps.get("hidden"));
      const firstVisibleItem = visibleItems[0];
      const lastVisibleItem = visibleItems[visibleItems.length - 1];
      this.bcSet_.items.forEach((bc) => {
        const ps = [];
        if (bc === firstVisibleItem) {
          ps.push("first");
          if (!this.blade_ || this.blade_.get("positions").includes("veryfirst")) {
            ps.push("veryfirst");
          }
        }
        if (bc === lastVisibleItem) {
          ps.push("last");
          if (!this.blade_ || this.blade_.get("positions").includes("verylast")) {
            ps.push("verylast");
          }
        }
        bc.blade.set("positions", ps);
      });
    }
    onChildPositionsChange_() {
      this.updatePositions_();
      this.emitter.emit("layout", {
        sender: this
      });
    }
    onChildViewPropsChange_(_ev) {
      this.updatePositions_();
      this.emitter.emit("layout", {
        sender: this
      });
    }
    onChildDispose_() {
      const disposedUcs = this.bcSet_.items.filter((bc) => {
        return bc.viewProps.get("disposed");
      });
      disposedUcs.forEach((bc) => {
        this.bcSet_.remove(bc);
      });
    }
    onChildValueChange_(ev) {
      const bc = findValueBladeController(this.find(isValueBladeController), ev.sender);
      if (!bc) {
        throw TpError.alreadyDisposed();
      }
      this.emitter.emit("valuechange", {
        bladeController: bc,
        options: ev.options,
        sender: this
      });
    }
    onRackLayout_(_2) {
      this.updatePositions_();
      this.emitter.emit("layout", {
        sender: this
      });
    }
    onRackValueChange_(ev) {
      this.emitter.emit("valuechange", {
        bladeController: ev.bladeController,
        options: ev.options,
        sender: this
      });
    }
    onBladePositionsChange_() {
      this.updatePositions_();
    }
  };
  var RackController = class {
    constructor(config) {
      this.onRackAdd_ = this.onRackAdd_.bind(this);
      this.onRackRemove_ = this.onRackRemove_.bind(this);
      this.element = config.element;
      this.viewProps = config.viewProps;
      const rack = new Rack({
        blade: config.root ? void 0 : config.blade,
        viewProps: config.viewProps
      });
      rack.emitter.on("add", this.onRackAdd_);
      rack.emitter.on("remove", this.onRackRemove_);
      this.rack = rack;
      this.viewProps.handleDispose(() => {
        for (let i = this.rack.children.length - 1; i >= 0; i--) {
          const bc = this.rack.children[i];
          bc.viewProps.set("disposed", true);
        }
      });
    }
    onRackAdd_(ev) {
      if (!ev.root) {
        return;
      }
      insertElementAt(this.element, ev.bladeController.view.element, ev.index);
    }
    onRackRemove_(ev) {
      if (!ev.root) {
        return;
      }
      removeElement(ev.bladeController.view.element);
    }
  };
  function createBlade() {
    return new ValueMap({
      positions: createValue([], {
        equals: deepEqualsArray
      })
    });
  }
  var Foldable = class extends ValueMap {
    constructor(valueMap) {
      super(valueMap);
    }
    static create(expanded) {
      const coreObj = {
        completed: true,
        expanded,
        expandedHeight: null,
        shouldFixHeight: false,
        temporaryExpanded: null
      };
      const core = ValueMap.createCore(coreObj);
      return new Foldable(core);
    }
    get styleExpanded() {
      var _a;
      return (_a = this.get("temporaryExpanded")) !== null && _a !== void 0 ? _a : this.get("expanded");
    }
    get styleHeight() {
      if (!this.styleExpanded) {
        return "0";
      }
      const exHeight = this.get("expandedHeight");
      if (this.get("shouldFixHeight") && !isEmpty(exHeight)) {
        return `${exHeight}px`;
      }
      return "auto";
    }
    bindExpandedClass(elem, expandedClassName) {
      const onExpand = () => {
        const expanded = this.styleExpanded;
        if (expanded) {
          elem.classList.add(expandedClassName);
        } else {
          elem.classList.remove(expandedClassName);
        }
      };
      bindValueMap(this, "expanded", onExpand);
      bindValueMap(this, "temporaryExpanded", onExpand);
    }
    cleanUpTransition() {
      this.set("shouldFixHeight", false);
      this.set("expandedHeight", null);
      this.set("completed", true);
    }
  };
  function computeExpandedFolderHeight(folder, containerElement) {
    let height = 0;
    disableTransitionTemporarily(containerElement, () => {
      folder.set("expandedHeight", null);
      folder.set("temporaryExpanded", true);
      forceReflow(containerElement);
      height = containerElement.clientHeight;
      folder.set("temporaryExpanded", null);
      forceReflow(containerElement);
    });
    return height;
  }
  function applyHeight(foldable, elem) {
    elem.style.height = foldable.styleHeight;
  }
  function bindFoldable(foldable, elem) {
    foldable.value("expanded").emitter.on("beforechange", () => {
      foldable.set("completed", false);
      if (isEmpty(foldable.get("expandedHeight"))) {
        const h2 = computeExpandedFolderHeight(foldable, elem);
        if (h2 > 0) {
          foldable.set("expandedHeight", h2);
        }
      }
      foldable.set("shouldFixHeight", true);
      forceReflow(elem);
    });
    foldable.emitter.on("change", () => {
      applyHeight(foldable, elem);
    });
    applyHeight(foldable, elem);
    elem.addEventListener("transitionend", (ev) => {
      if (ev.propertyName !== "height") {
        return;
      }
      foldable.cleanUpTransition();
    });
  }
  var FolderApi = class extends ContainerBladeApi {
    constructor(controller, pool) {
      super(controller, pool);
      this.emitter_ = new Emitter();
      this.controller.foldable.value("expanded").emitter.on("change", (ev) => {
        this.emitter_.emit("fold", new TpFoldEvent(this, ev.sender.rawValue));
      });
      this.rackApi_.on("change", (ev) => {
        this.emitter_.emit("change", ev);
      });
    }
    get expanded() {
      return this.controller.foldable.get("expanded");
    }
    set expanded(expanded) {
      this.controller.foldable.set("expanded", expanded);
    }
    get title() {
      return this.controller.props.get("title");
    }
    set title(title) {
      this.controller.props.set("title", title);
    }
    get children() {
      return this.rackApi_.children;
    }
    addBinding(object, key, opt_params) {
      return this.rackApi_.addBinding(object, key, opt_params);
    }
    addFolder(params) {
      return this.rackApi_.addFolder(params);
    }
    addButton(params) {
      return this.rackApi_.addButton(params);
    }
    addTab(params) {
      return this.rackApi_.addTab(params);
    }
    add(api, opt_index) {
      return this.rackApi_.add(api, opt_index);
    }
    remove(api) {
      this.rackApi_.remove(api);
    }
    addBlade(params) {
      return this.rackApi_.addBlade(params);
    }
    on(eventName, handler) {
      const bh = handler.bind(this);
      this.emitter_.on(eventName, (ev) => {
        bh(ev);
      });
      return this;
    }
  };
  var bladeContainerClassName = ClassName("cnt");
  var FolderView = class {
    constructor(doc, config) {
      var _a;
      this.className_ = ClassName((_a = config.viewName) !== null && _a !== void 0 ? _a : "fld");
      this.element = doc.createElement("div");
      this.element.classList.add(this.className_(), bladeContainerClassName());
      config.viewProps.bindClassModifiers(this.element);
      this.foldable_ = config.foldable;
      this.foldable_.bindExpandedClass(this.element, this.className_(void 0, "expanded"));
      bindValueMap(this.foldable_, "completed", valueToClassName(this.element, this.className_(void 0, "cpl")));
      const buttonElem = doc.createElement("button");
      buttonElem.classList.add(this.className_("b"));
      bindValueMap(config.props, "title", (title) => {
        if (isEmpty(title)) {
          this.element.classList.add(this.className_(void 0, "not"));
        } else {
          this.element.classList.remove(this.className_(void 0, "not"));
        }
      });
      config.viewProps.bindDisabled(buttonElem);
      this.element.appendChild(buttonElem);
      this.buttonElement = buttonElem;
      const indentElem = doc.createElement("div");
      indentElem.classList.add(this.className_("i"));
      this.element.appendChild(indentElem);
      const titleElem = doc.createElement("div");
      titleElem.classList.add(this.className_("t"));
      bindValueToTextContent(config.props.value("title"), titleElem);
      this.buttonElement.appendChild(titleElem);
      this.titleElement = titleElem;
      const markElem = doc.createElement("div");
      markElem.classList.add(this.className_("m"));
      this.buttonElement.appendChild(markElem);
      const containerElem = doc.createElement("div");
      containerElem.classList.add(this.className_("c"));
      this.element.appendChild(containerElem);
      this.containerElement = containerElem;
    }
  };
  var FolderController = class extends ContainerBladeController {
    constructor(doc, config) {
      var _a;
      const foldable = Foldable.create((_a = config.expanded) !== null && _a !== void 0 ? _a : true);
      const view = new FolderView(doc, {
        foldable,
        props: config.props,
        viewName: config.root ? "rot" : void 0,
        viewProps: config.viewProps
      });
      super(Object.assign(Object.assign({}, config), { rackController: new RackController({
        blade: config.blade,
        element: view.containerElement,
        root: config.root,
        viewProps: config.viewProps
      }), view }));
      this.onTitleClick_ = this.onTitleClick_.bind(this);
      this.props = config.props;
      this.foldable = foldable;
      bindFoldable(this.foldable, this.view.containerElement);
      this.rackController.rack.emitter.on("add", () => {
        this.foldable.cleanUpTransition();
      });
      this.rackController.rack.emitter.on("remove", () => {
        this.foldable.cleanUpTransition();
      });
      this.view.buttonElement.addEventListener("click", this.onTitleClick_);
    }
    get document() {
      return this.view.element.ownerDocument;
    }
    importState(state) {
      return importBladeState(state, (s) => super.importState(s), (p2) => ({
        expanded: p2.required.boolean,
        title: p2.optional.string
      }), (result) => {
        this.foldable.set("expanded", result.expanded);
        this.props.set("title", result.title);
        return true;
      });
    }
    exportState() {
      return exportBladeState(() => super.exportState(), {
        expanded: this.foldable.get("expanded"),
        title: this.props.get("title")
      });
    }
    onTitleClick_() {
      this.foldable.set("expanded", !this.foldable.get("expanded"));
    }
  };
  var FolderBladePlugin = createPlugin({
    id: "folder",
    type: "blade",
    accept(params) {
      const result = parseRecord(params, (p2) => ({
        title: p2.required.string,
        view: p2.required.constant("folder"),
        expanded: p2.optional.boolean
      }));
      return result ? { params: result } : null;
    },
    controller(args) {
      return new FolderController(args.document, {
        blade: args.blade,
        expanded: args.params.expanded,
        props: ValueMap.fromObject({
          title: args.params.title
        }),
        viewProps: args.viewProps
      });
    },
    api(args) {
      if (!(args.controller instanceof FolderController)) {
        return null;
      }
      return new FolderApi(args.controller, args.pool);
    }
  });
  var cn$o = ClassName("");
  function valueToModifier(elem, modifier) {
    return valueToClassName(elem, cn$o(void 0, modifier));
  }
  var ViewProps = class extends ValueMap {
    constructor(valueMap) {
      var _a;
      super(valueMap);
      this.onDisabledChange_ = this.onDisabledChange_.bind(this);
      this.onParentChange_ = this.onParentChange_.bind(this);
      this.onParentGlobalDisabledChange_ = this.onParentGlobalDisabledChange_.bind(this);
      [this.globalDisabled_, this.setGlobalDisabled_] = createReadonlyValue(createValue(this.getGlobalDisabled_()));
      this.value("disabled").emitter.on("change", this.onDisabledChange_);
      this.value("parent").emitter.on("change", this.onParentChange_);
      (_a = this.get("parent")) === null || _a === void 0 ? void 0 : _a.globalDisabled.emitter.on("change", this.onParentGlobalDisabledChange_);
    }
    static create(opt_initialValue) {
      var _a, _b, _c;
      const initialValue = opt_initialValue !== null && opt_initialValue !== void 0 ? opt_initialValue : {};
      return new ViewProps(ValueMap.createCore({
        disabled: (_a = initialValue.disabled) !== null && _a !== void 0 ? _a : false,
        disposed: false,
        hidden: (_b = initialValue.hidden) !== null && _b !== void 0 ? _b : false,
        parent: (_c = initialValue.parent) !== null && _c !== void 0 ? _c : null
      }));
    }
    get globalDisabled() {
      return this.globalDisabled_;
    }
    bindClassModifiers(elem) {
      bindValue(this.globalDisabled_, valueToModifier(elem, "disabled"));
      bindValueMap(this, "hidden", valueToModifier(elem, "hidden"));
    }
    bindDisabled(target2) {
      bindValue(this.globalDisabled_, (disabled) => {
        target2.disabled = disabled;
      });
    }
    bindTabIndex(elem) {
      bindValue(this.globalDisabled_, (disabled) => {
        elem.tabIndex = disabled ? -1 : 0;
      });
    }
    handleDispose(callback) {
      this.value("disposed").emitter.on("change", (disposed) => {
        if (disposed) {
          callback();
        }
      });
    }
    importState(state) {
      this.set("disabled", state.disabled);
      this.set("hidden", state.hidden);
    }
    exportState() {
      return {
        disabled: this.get("disabled"),
        hidden: this.get("hidden")
      };
    }
    getGlobalDisabled_() {
      const parent = this.get("parent");
      const parentDisabled = parent ? parent.globalDisabled.rawValue : false;
      return parentDisabled || this.get("disabled");
    }
    updateGlobalDisabled_() {
      this.setGlobalDisabled_(this.getGlobalDisabled_());
    }
    onDisabledChange_() {
      this.updateGlobalDisabled_();
    }
    onParentGlobalDisabledChange_() {
      this.updateGlobalDisabled_();
    }
    onParentChange_(ev) {
      var _a;
      const prevParent = ev.previousRawValue;
      prevParent === null || prevParent === void 0 ? void 0 : prevParent.globalDisabled.emitter.off("change", this.onParentGlobalDisabledChange_);
      (_a = this.get("parent")) === null || _a === void 0 ? void 0 : _a.globalDisabled.emitter.on("change", this.onParentGlobalDisabledChange_);
      this.updateGlobalDisabled_();
    }
  };
  var cn$n = ClassName("tbp");
  var TabPageView = class {
    constructor(doc, config) {
      this.element = doc.createElement("div");
      this.element.classList.add(cn$n());
      config.viewProps.bindClassModifiers(this.element);
      const containerElem = doc.createElement("div");
      containerElem.classList.add(cn$n("c"));
      this.element.appendChild(containerElem);
      this.containerElement = containerElem;
    }
  };
  var cn$m = ClassName("tbi");
  var TabItemView = class {
    constructor(doc, config) {
      this.element = doc.createElement("div");
      this.element.classList.add(cn$m());
      config.viewProps.bindClassModifiers(this.element);
      bindValueMap(config.props, "selected", (selected) => {
        if (selected) {
          this.element.classList.add(cn$m(void 0, "sel"));
        } else {
          this.element.classList.remove(cn$m(void 0, "sel"));
        }
      });
      const buttonElem = doc.createElement("button");
      buttonElem.classList.add(cn$m("b"));
      config.viewProps.bindDisabled(buttonElem);
      this.element.appendChild(buttonElem);
      this.buttonElement = buttonElem;
      const titleElem = doc.createElement("div");
      titleElem.classList.add(cn$m("t"));
      bindValueToTextContent(config.props.value("title"), titleElem);
      this.buttonElement.appendChild(titleElem);
      this.titleElement = titleElem;
    }
  };
  var TabItemController = class {
    constructor(doc, config) {
      this.emitter = new Emitter();
      this.onClick_ = this.onClick_.bind(this);
      this.props = config.props;
      this.viewProps = config.viewProps;
      this.view = new TabItemView(doc, {
        props: config.props,
        viewProps: config.viewProps
      });
      this.view.buttonElement.addEventListener("click", this.onClick_);
    }
    onClick_() {
      this.emitter.emit("click", {
        sender: this
      });
    }
  };
  var TabPageController = class extends ContainerBladeController {
    constructor(doc, config) {
      const view = new TabPageView(doc, {
        viewProps: config.viewProps
      });
      super(Object.assign(Object.assign({}, config), { rackController: new RackController({
        blade: config.blade,
        element: view.containerElement,
        viewProps: config.viewProps
      }), view }));
      this.onItemClick_ = this.onItemClick_.bind(this);
      this.ic_ = new TabItemController(doc, {
        props: config.itemProps,
        viewProps: ViewProps.create()
      });
      this.ic_.emitter.on("click", this.onItemClick_);
      this.props = config.props;
      bindValueMap(this.props, "selected", (selected) => {
        this.itemController.props.set("selected", selected);
        this.viewProps.set("hidden", !selected);
      });
    }
    get itemController() {
      return this.ic_;
    }
    importState(state) {
      return importBladeState(state, (s) => super.importState(s), (p2) => ({
        selected: p2.required.boolean,
        title: p2.required.string
      }), (result) => {
        this.ic_.props.set("selected", result.selected);
        this.ic_.props.set("title", result.title);
        return true;
      });
    }
    exportState() {
      return exportBladeState(() => super.exportState(), {
        selected: this.ic_.props.get("selected"),
        title: this.ic_.props.get("title")
      });
    }
    onItemClick_() {
      this.props.set("selected", true);
    }
  };
  var TabApi = class extends ContainerBladeApi {
    constructor(controller, pool) {
      super(controller, pool);
      this.emitter_ = new Emitter();
      this.onSelect_ = this.onSelect_.bind(this);
      this.pool_ = pool;
      this.rackApi_.on("change", (ev) => {
        this.emitter_.emit("change", ev);
      });
      this.controller.tab.selectedIndex.emitter.on("change", this.onSelect_);
    }
    get pages() {
      return this.rackApi_.children;
    }
    addPage(params) {
      const doc = this.controller.view.element.ownerDocument;
      const pc = new TabPageController(doc, {
        blade: createBlade(),
        itemProps: ValueMap.fromObject({
          selected: false,
          title: params.title
        }),
        props: ValueMap.fromObject({
          selected: false
        }),
        viewProps: ViewProps.create()
      });
      const papi = this.pool_.createApi(pc);
      return this.rackApi_.add(papi, params.index);
    }
    removePage(index) {
      this.rackApi_.remove(this.rackApi_.children[index]);
    }
    on(eventName, handler) {
      const bh = handler.bind(this);
      this.emitter_.on(eventName, (ev) => {
        bh(ev);
      });
      return this;
    }
    onSelect_(ev) {
      this.emitter_.emit("select", new TpTabSelectEvent(this, ev.rawValue));
    }
  };
  var TabPageApi = class extends ContainerBladeApi {
    get title() {
      var _a;
      return (_a = this.controller.itemController.props.get("title")) !== null && _a !== void 0 ? _a : "";
    }
    set title(title) {
      this.controller.itemController.props.set("title", title);
    }
    get selected() {
      return this.controller.props.get("selected");
    }
    set selected(selected) {
      this.controller.props.set("selected", selected);
    }
    get children() {
      return this.rackApi_.children;
    }
    addButton(params) {
      return this.rackApi_.addButton(params);
    }
    addFolder(params) {
      return this.rackApi_.addFolder(params);
    }
    addTab(params) {
      return this.rackApi_.addTab(params);
    }
    add(api, opt_index) {
      this.rackApi_.add(api, opt_index);
    }
    remove(api) {
      this.rackApi_.remove(api);
    }
    addBinding(object, key, opt_params) {
      return this.rackApi_.addBinding(object, key, opt_params);
    }
    addBlade(params) {
      return this.rackApi_.addBlade(params);
    }
  };
  var INDEX_NOT_SELECTED = -1;
  var Tab = class {
    constructor() {
      this.onItemSelectedChange_ = this.onItemSelectedChange_.bind(this);
      this.empty = createValue(true);
      this.selectedIndex = createValue(INDEX_NOT_SELECTED);
      this.items_ = [];
    }
    add(item, opt_index) {
      const index = opt_index !== null && opt_index !== void 0 ? opt_index : this.items_.length;
      this.items_.splice(index, 0, item);
      item.emitter.on("change", this.onItemSelectedChange_);
      this.keepSelection_();
    }
    remove(item) {
      const index = this.items_.indexOf(item);
      if (index < 0) {
        return;
      }
      this.items_.splice(index, 1);
      item.emitter.off("change", this.onItemSelectedChange_);
      this.keepSelection_();
    }
    keepSelection_() {
      if (this.items_.length === 0) {
        this.selectedIndex.rawValue = INDEX_NOT_SELECTED;
        this.empty.rawValue = true;
        return;
      }
      const firstSelIndex = this.items_.findIndex((s) => s.rawValue);
      if (firstSelIndex < 0) {
        this.items_.forEach((s, i) => {
          s.rawValue = i === 0;
        });
        this.selectedIndex.rawValue = 0;
      } else {
        this.items_.forEach((s, i) => {
          s.rawValue = i === firstSelIndex;
        });
        this.selectedIndex.rawValue = firstSelIndex;
      }
      this.empty.rawValue = false;
    }
    onItemSelectedChange_(ev) {
      if (ev.rawValue) {
        const index = this.items_.findIndex((s) => s === ev.sender);
        this.items_.forEach((s, i) => {
          s.rawValue = i === index;
        });
        this.selectedIndex.rawValue = index;
      } else {
        this.keepSelection_();
      }
    }
  };
  var cn$l = ClassName("tab");
  var TabView = class {
    constructor(doc, config) {
      this.element = doc.createElement("div");
      this.element.classList.add(cn$l(), bladeContainerClassName());
      config.viewProps.bindClassModifiers(this.element);
      bindValue(config.empty, valueToClassName(this.element, cn$l(void 0, "nop")));
      const titleElem = doc.createElement("div");
      titleElem.classList.add(cn$l("t"));
      this.element.appendChild(titleElem);
      this.itemsElement = titleElem;
      const indentElem = doc.createElement("div");
      indentElem.classList.add(cn$l("i"));
      this.element.appendChild(indentElem);
      const contentsElem = doc.createElement("div");
      contentsElem.classList.add(cn$l("c"));
      this.element.appendChild(contentsElem);
      this.contentsElement = contentsElem;
    }
  };
  var TabController = class extends ContainerBladeController {
    constructor(doc, config) {
      const tab = new Tab();
      const view = new TabView(doc, {
        empty: tab.empty,
        viewProps: config.viewProps
      });
      super({
        blade: config.blade,
        rackController: new RackController({
          blade: config.blade,
          element: view.contentsElement,
          viewProps: config.viewProps
        }),
        view
      });
      this.onRackAdd_ = this.onRackAdd_.bind(this);
      this.onRackRemove_ = this.onRackRemove_.bind(this);
      const rack = this.rackController.rack;
      rack.emitter.on("add", this.onRackAdd_);
      rack.emitter.on("remove", this.onRackRemove_);
      this.tab = tab;
    }
    add(pc, opt_index) {
      this.rackController.rack.add(pc, opt_index);
    }
    remove(index) {
      this.rackController.rack.remove(this.rackController.rack.children[index]);
    }
    onRackAdd_(ev) {
      if (!ev.root) {
        return;
      }
      const pc = ev.bladeController;
      insertElementAt(this.view.itemsElement, pc.itemController.view.element, ev.index);
      pc.itemController.viewProps.set("parent", this.viewProps);
      this.tab.add(pc.props.value("selected"));
    }
    onRackRemove_(ev) {
      if (!ev.root) {
        return;
      }
      const pc = ev.bladeController;
      removeElement(pc.itemController.view.element);
      pc.itemController.viewProps.set("parent", null);
      this.tab.remove(pc.props.value("selected"));
    }
  };
  var TabBladePlugin = createPlugin({
    id: "tab",
    type: "blade",
    accept(params) {
      const result = parseRecord(params, (p2) => ({
        pages: p2.required.array(p2.required.object({ title: p2.required.string })),
        view: p2.required.constant("tab")
      }));
      if (!result || result.pages.length === 0) {
        return null;
      }
      return { params: result };
    },
    controller(args) {
      const c2 = new TabController(args.document, {
        blade: args.blade,
        viewProps: args.viewProps
      });
      args.params.pages.forEach((p2) => {
        const pc = new TabPageController(args.document, {
          blade: createBlade(),
          itemProps: ValueMap.fromObject({
            selected: false,
            title: p2.title
          }),
          props: ValueMap.fromObject({
            selected: false
          }),
          viewProps: ViewProps.create()
        });
        c2.add(pc);
      });
      return c2;
    },
    api(args) {
      if (args.controller instanceof TabController) {
        return new TabApi(args.controller, args.pool);
      }
      if (args.controller instanceof TabPageController) {
        return new TabPageApi(args.controller, args.pool);
      }
      return null;
    }
  });
  var ListInputBindingApi = class extends BindingApi {
    get options() {
      return this.controller.valueController.props.get("options");
    }
    set options(options) {
      this.controller.valueController.props.set("options", options);
    }
  };
  var CompositeConstraint = class {
    constructor(constraints) {
      this.constraints = constraints;
    }
    constrain(value) {
      return this.constraints.reduce((result, c2) => {
        return c2.constrain(result);
      }, value);
    }
  };
  function findConstraint(c2, constraintClass) {
    if (c2 instanceof constraintClass) {
      return c2;
    }
    if (c2 instanceof CompositeConstraint) {
      const result = c2.constraints.reduce((tmpResult, sc) => {
        if (tmpResult) {
          return tmpResult;
        }
        return sc instanceof constraintClass ? sc : null;
      }, null);
      if (result) {
        return result;
      }
    }
    return null;
  }
  var ListConstraint = class {
    constructor(options) {
      this.values = ValueMap.fromObject({
        options
      });
    }
    constrain(value) {
      const opts = this.values.get("options");
      if (opts.length === 0) {
        return value;
      }
      const matched = opts.filter((item) => {
        return item.value === value;
      }).length > 0;
      return matched ? value : opts[0].value;
    }
  };
  function parseListOptions(value) {
    var _a;
    const p2 = MicroParsers;
    if (Array.isArray(value)) {
      return (_a = parseRecord({ items: value }, (p3) => ({
        items: p3.required.array(p3.required.object({
          text: p3.required.string,
          value: p3.required.raw
        }))
      }))) === null || _a === void 0 ? void 0 : _a.items;
    }
    if (typeof value === "object") {
      return p2.required.raw(value).value;
    }
    return void 0;
  }
  function normalizeListOptions(options) {
    if (Array.isArray(options)) {
      return options;
    }
    const items = [];
    Object.keys(options).forEach((text) => {
      items.push({ text, value: options[text] });
    });
    return items;
  }
  function createListConstraint(options) {
    return !isEmpty(options) ? new ListConstraint(normalizeListOptions(forceCast(options))) : null;
  }
  var cn$k = ClassName("lst");
  var ListView = class {
    constructor(doc, config) {
      this.onValueChange_ = this.onValueChange_.bind(this);
      this.props_ = config.props;
      this.element = doc.createElement("div");
      this.element.classList.add(cn$k());
      config.viewProps.bindClassModifiers(this.element);
      const selectElem = doc.createElement("select");
      selectElem.classList.add(cn$k("s"));
      config.viewProps.bindDisabled(selectElem);
      this.element.appendChild(selectElem);
      this.selectElement = selectElem;
      const markElem = doc.createElement("div");
      markElem.classList.add(cn$k("m"));
      markElem.appendChild(createSvgIconElement(doc, "dropdown"));
      this.element.appendChild(markElem);
      config.value.emitter.on("change", this.onValueChange_);
      this.value_ = config.value;
      bindValueMap(this.props_, "options", (opts) => {
        removeChildElements(this.selectElement);
        opts.forEach((item) => {
          const optionElem = doc.createElement("option");
          optionElem.textContent = item.text;
          this.selectElement.appendChild(optionElem);
        });
        this.update_();
      });
    }
    update_() {
      const values = this.props_.get("options").map((o) => o.value);
      this.selectElement.selectedIndex = values.indexOf(this.value_.rawValue);
    }
    onValueChange_() {
      this.update_();
    }
  };
  var ListController = class {
    constructor(doc, config) {
      this.onSelectChange_ = this.onSelectChange_.bind(this);
      this.props = config.props;
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.view = new ListView(doc, {
        props: this.props,
        value: this.value,
        viewProps: this.viewProps
      });
      this.view.selectElement.addEventListener("change", this.onSelectChange_);
    }
    onSelectChange_(e) {
      const selectElem = forceCast(e.currentTarget);
      this.value.rawValue = this.props.get("options")[selectElem.selectedIndex].value;
    }
    importProps(state) {
      return importBladeState(state, null, (p2) => ({
        options: p2.required.custom(parseListOptions)
      }), (result) => {
        this.props.set("options", normalizeListOptions(result.options));
        return true;
      });
    }
    exportProps() {
      return exportBladeState(null, {
        options: this.props.get("options")
      });
    }
  };
  var cn$j = ClassName("pop");
  var PopupView = class {
    constructor(doc, config) {
      this.element = doc.createElement("div");
      this.element.classList.add(cn$j());
      config.viewProps.bindClassModifiers(this.element);
      bindValue(config.shows, valueToClassName(this.element, cn$j(void 0, "v")));
    }
  };
  var PopupController = class {
    constructor(doc, config) {
      this.shows = createValue(false);
      this.viewProps = config.viewProps;
      this.view = new PopupView(doc, {
        shows: this.shows,
        viewProps: this.viewProps
      });
    }
  };
  var cn$i = ClassName("txt");
  var TextView = class {
    constructor(doc, config) {
      this.onChange_ = this.onChange_.bind(this);
      this.element = doc.createElement("div");
      this.element.classList.add(cn$i());
      config.viewProps.bindClassModifiers(this.element);
      this.props_ = config.props;
      this.props_.emitter.on("change", this.onChange_);
      const inputElem = doc.createElement("input");
      inputElem.classList.add(cn$i("i"));
      inputElem.type = "text";
      config.viewProps.bindDisabled(inputElem);
      this.element.appendChild(inputElem);
      this.inputElement = inputElem;
      config.value.emitter.on("change", this.onChange_);
      this.value_ = config.value;
      this.refresh();
    }
    refresh() {
      const formatter = this.props_.get("formatter");
      this.inputElement.value = formatter(this.value_.rawValue);
    }
    onChange_() {
      this.refresh();
    }
  };
  var TextController = class {
    constructor(doc, config) {
      this.onInputChange_ = this.onInputChange_.bind(this);
      this.parser_ = config.parser;
      this.props = config.props;
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.view = new TextView(doc, {
        props: config.props,
        value: this.value,
        viewProps: this.viewProps
      });
      this.view.inputElement.addEventListener("change", this.onInputChange_);
    }
    onInputChange_(e) {
      const inputElem = forceCast(e.currentTarget);
      const value = inputElem.value;
      const parsedValue = this.parser_(value);
      if (!isEmpty(parsedValue)) {
        this.value.rawValue = parsedValue;
      }
      this.view.refresh();
    }
  };
  function boolToString(value) {
    return String(value);
  }
  function boolFromUnknown(value) {
    if (value === "false") {
      return false;
    }
    return !!value;
  }
  function BooleanFormatter(value) {
    return boolToString(value);
  }
  function composeParsers(parsers) {
    return (text) => {
      return parsers.reduce((result, parser) => {
        if (result !== null) {
          return result;
        }
        return parser(text);
      }, null);
    };
  }
  var innerFormatter = createNumberFormatter(0);
  function formatPercentage(value) {
    return innerFormatter(value) + "%";
  }
  function stringFromUnknown(value) {
    return String(value);
  }
  function formatString(value) {
    return value;
  }
  function connectValues({ primary, secondary, forward, backward }) {
    let changing = false;
    function preventFeedback(callback) {
      if (changing) {
        return;
      }
      changing = true;
      callback();
      changing = false;
    }
    primary.emitter.on("change", (ev) => {
      preventFeedback(() => {
        secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), ev.options);
      });
    });
    secondary.emitter.on("change", (ev) => {
      preventFeedback(() => {
        primary.setRawValue(backward(primary.rawValue, secondary.rawValue), ev.options);
      });
      preventFeedback(() => {
        secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), ev.options);
      });
    });
    preventFeedback(() => {
      secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), {
        forceEmit: false,
        last: true
      });
    });
  }
  function getStepForKey(keyScale, keys) {
    const step = keyScale * (keys.altKey ? 0.1 : 1) * (keys.shiftKey ? 10 : 1);
    if (keys.upKey) {
      return +step;
    } else if (keys.downKey) {
      return -step;
    }
    return 0;
  }
  function getVerticalStepKeys(ev) {
    return {
      altKey: ev.altKey,
      downKey: ev.key === "ArrowDown",
      shiftKey: ev.shiftKey,
      upKey: ev.key === "ArrowUp"
    };
  }
  function getHorizontalStepKeys(ev) {
    return {
      altKey: ev.altKey,
      downKey: ev.key === "ArrowLeft",
      shiftKey: ev.shiftKey,
      upKey: ev.key === "ArrowRight"
    };
  }
  function isVerticalArrowKey(key) {
    return key === "ArrowUp" || key === "ArrowDown";
  }
  function isArrowKey(key) {
    return isVerticalArrowKey(key) || key === "ArrowLeft" || key === "ArrowRight";
  }
  function computeOffset$1(ev, elem) {
    var _a, _b;
    const win = elem.ownerDocument.defaultView;
    const rect = elem.getBoundingClientRect();
    return {
      x: ev.pageX - (((_a = win && win.scrollX) !== null && _a !== void 0 ? _a : 0) + rect.left),
      y: ev.pageY - (((_b = win && win.scrollY) !== null && _b !== void 0 ? _b : 0) + rect.top)
    };
  }
  var PointerHandler = class {
    constructor(element) {
      this.lastTouch_ = null;
      this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
      this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);
      this.onMouseDown_ = this.onMouseDown_.bind(this);
      this.onTouchEnd_ = this.onTouchEnd_.bind(this);
      this.onTouchMove_ = this.onTouchMove_.bind(this);
      this.onTouchStart_ = this.onTouchStart_.bind(this);
      this.elem_ = element;
      this.emitter = new Emitter();
      element.addEventListener("touchstart", this.onTouchStart_, {
        passive: false
      });
      element.addEventListener("touchmove", this.onTouchMove_, {
        passive: true
      });
      element.addEventListener("touchend", this.onTouchEnd_);
      element.addEventListener("mousedown", this.onMouseDown_);
    }
    computePosition_(offset) {
      const rect = this.elem_.getBoundingClientRect();
      return {
        bounds: {
          width: rect.width,
          height: rect.height
        },
        point: offset ? {
          x: offset.x,
          y: offset.y
        } : null
      };
    }
    onMouseDown_(ev) {
      var _a;
      ev.preventDefault();
      (_a = ev.currentTarget) === null || _a === void 0 ? void 0 : _a.focus();
      const doc = this.elem_.ownerDocument;
      doc.addEventListener("mousemove", this.onDocumentMouseMove_);
      doc.addEventListener("mouseup", this.onDocumentMouseUp_);
      this.emitter.emit("down", {
        altKey: ev.altKey,
        data: this.computePosition_(computeOffset$1(ev, this.elem_)),
        sender: this,
        shiftKey: ev.shiftKey
      });
    }
    onDocumentMouseMove_(ev) {
      this.emitter.emit("move", {
        altKey: ev.altKey,
        data: this.computePosition_(computeOffset$1(ev, this.elem_)),
        sender: this,
        shiftKey: ev.shiftKey
      });
    }
    onDocumentMouseUp_(ev) {
      const doc = this.elem_.ownerDocument;
      doc.removeEventListener("mousemove", this.onDocumentMouseMove_);
      doc.removeEventListener("mouseup", this.onDocumentMouseUp_);
      this.emitter.emit("up", {
        altKey: ev.altKey,
        data: this.computePosition_(computeOffset$1(ev, this.elem_)),
        sender: this,
        shiftKey: ev.shiftKey
      });
    }
    onTouchStart_(ev) {
      ev.preventDefault();
      const touch = ev.targetTouches.item(0);
      const rect = this.elem_.getBoundingClientRect();
      this.emitter.emit("down", {
        altKey: ev.altKey,
        data: this.computePosition_(touch ? {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        } : void 0),
        sender: this,
        shiftKey: ev.shiftKey
      });
      this.lastTouch_ = touch;
    }
    onTouchMove_(ev) {
      const touch = ev.targetTouches.item(0);
      const rect = this.elem_.getBoundingClientRect();
      this.emitter.emit("move", {
        altKey: ev.altKey,
        data: this.computePosition_(touch ? {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        } : void 0),
        sender: this,
        shiftKey: ev.shiftKey
      });
      this.lastTouch_ = touch;
    }
    onTouchEnd_(ev) {
      var _a;
      const touch = (_a = ev.targetTouches.item(0)) !== null && _a !== void 0 ? _a : this.lastTouch_;
      const rect = this.elem_.getBoundingClientRect();
      this.emitter.emit("up", {
        altKey: ev.altKey,
        data: this.computePosition_(touch ? {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        } : void 0),
        sender: this,
        shiftKey: ev.shiftKey
      });
    }
  };
  var cn$h = ClassName("txt");
  var NumberTextView = class {
    constructor(doc, config) {
      this.onChange_ = this.onChange_.bind(this);
      this.props_ = config.props;
      this.props_.emitter.on("change", this.onChange_);
      this.element = doc.createElement("div");
      this.element.classList.add(cn$h(), cn$h(void 0, "num"));
      if (config.arrayPosition) {
        this.element.classList.add(cn$h(void 0, config.arrayPosition));
      }
      config.viewProps.bindClassModifiers(this.element);
      const inputElem = doc.createElement("input");
      inputElem.classList.add(cn$h("i"));
      inputElem.type = "text";
      config.viewProps.bindDisabled(inputElem);
      this.element.appendChild(inputElem);
      this.inputElement = inputElem;
      this.onDraggingChange_ = this.onDraggingChange_.bind(this);
      this.dragging_ = config.dragging;
      this.dragging_.emitter.on("change", this.onDraggingChange_);
      this.element.classList.add(cn$h());
      this.inputElement.classList.add(cn$h("i"));
      const knobElem = doc.createElement("div");
      knobElem.classList.add(cn$h("k"));
      this.element.appendChild(knobElem);
      this.knobElement = knobElem;
      const guideElem = doc.createElementNS(SVG_NS, "svg");
      guideElem.classList.add(cn$h("g"));
      this.knobElement.appendChild(guideElem);
      const bodyElem = doc.createElementNS(SVG_NS, "path");
      bodyElem.classList.add(cn$h("gb"));
      guideElem.appendChild(bodyElem);
      this.guideBodyElem_ = bodyElem;
      const headElem = doc.createElementNS(SVG_NS, "path");
      headElem.classList.add(cn$h("gh"));
      guideElem.appendChild(headElem);
      this.guideHeadElem_ = headElem;
      const tooltipElem = doc.createElement("div");
      tooltipElem.classList.add(ClassName("tt")());
      this.knobElement.appendChild(tooltipElem);
      this.tooltipElem_ = tooltipElem;
      config.value.emitter.on("change", this.onChange_);
      this.value = config.value;
      this.refresh();
    }
    onDraggingChange_(ev) {
      if (ev.rawValue === null) {
        this.element.classList.remove(cn$h(void 0, "drg"));
        return;
      }
      this.element.classList.add(cn$h(void 0, "drg"));
      const x2 = ev.rawValue / this.props_.get("pointerScale");
      const aox = x2 + (x2 > 0 ? -1 : x2 < 0 ? 1 : 0);
      const adx = constrainRange(-aox, -4, 4);
      this.guideHeadElem_.setAttributeNS(null, "d", [`M ${aox + adx},0 L${aox},4 L${aox + adx},8`, `M ${x2},-1 L${x2},9`].join(" "));
      this.guideBodyElem_.setAttributeNS(null, "d", `M 0,4 L${x2},4`);
      const formatter = this.props_.get("formatter");
      this.tooltipElem_.textContent = formatter(this.value.rawValue);
      this.tooltipElem_.style.left = `${x2}px`;
    }
    refresh() {
      const formatter = this.props_.get("formatter");
      this.inputElement.value = formatter(this.value.rawValue);
    }
    onChange_() {
      this.refresh();
    }
  };
  var NumberTextController = class {
    constructor(doc, config) {
      var _a;
      this.originRawValue_ = 0;
      this.onInputChange_ = this.onInputChange_.bind(this);
      this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);
      this.onInputKeyUp_ = this.onInputKeyUp_.bind(this);
      this.onPointerDown_ = this.onPointerDown_.bind(this);
      this.onPointerMove_ = this.onPointerMove_.bind(this);
      this.onPointerUp_ = this.onPointerUp_.bind(this);
      this.parser_ = config.parser;
      this.props = config.props;
      this.sliderProps_ = (_a = config.sliderProps) !== null && _a !== void 0 ? _a : null;
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.dragging_ = createValue(null);
      this.view = new NumberTextView(doc, {
        arrayPosition: config.arrayPosition,
        dragging: this.dragging_,
        props: this.props,
        value: this.value,
        viewProps: this.viewProps
      });
      this.view.inputElement.addEventListener("change", this.onInputChange_);
      this.view.inputElement.addEventListener("keydown", this.onInputKeyDown_);
      this.view.inputElement.addEventListener("keyup", this.onInputKeyUp_);
      const ph = new PointerHandler(this.view.knobElement);
      ph.emitter.on("down", this.onPointerDown_);
      ph.emitter.on("move", this.onPointerMove_);
      ph.emitter.on("up", this.onPointerUp_);
    }
    constrainValue_(value) {
      var _a, _b;
      const min = (_a = this.sliderProps_) === null || _a === void 0 ? void 0 : _a.get("min");
      const max = (_b = this.sliderProps_) === null || _b === void 0 ? void 0 : _b.get("max");
      let v2 = value;
      if (min !== void 0) {
        v2 = Math.max(v2, min);
      }
      if (max !== void 0) {
        v2 = Math.min(v2, max);
      }
      return v2;
    }
    onInputChange_(e) {
      const inputElem = forceCast(e.currentTarget);
      const value = inputElem.value;
      const parsedValue = this.parser_(value);
      if (!isEmpty(parsedValue)) {
        this.value.rawValue = this.constrainValue_(parsedValue);
      }
      this.view.refresh();
    }
    onInputKeyDown_(ev) {
      const step = getStepForKey(this.props.get("keyScale"), getVerticalStepKeys(ev));
      if (step === 0) {
        return;
      }
      this.value.setRawValue(this.constrainValue_(this.value.rawValue + step), {
        forceEmit: false,
        last: false
      });
    }
    onInputKeyUp_(ev) {
      const step = getStepForKey(this.props.get("keyScale"), getVerticalStepKeys(ev));
      if (step === 0) {
        return;
      }
      this.value.setRawValue(this.value.rawValue, {
        forceEmit: true,
        last: true
      });
    }
    onPointerDown_() {
      this.originRawValue_ = this.value.rawValue;
      this.dragging_.rawValue = 0;
    }
    computeDraggingValue_(data) {
      if (!data.point) {
        return null;
      }
      const dx = data.point.x - data.bounds.width / 2;
      return this.constrainValue_(this.originRawValue_ + dx * this.props.get("pointerScale"));
    }
    onPointerMove_(ev) {
      const v2 = this.computeDraggingValue_(ev.data);
      if (v2 === null) {
        return;
      }
      this.value.setRawValue(v2, {
        forceEmit: false,
        last: false
      });
      this.dragging_.rawValue = this.value.rawValue - this.originRawValue_;
    }
    onPointerUp_(ev) {
      const v2 = this.computeDraggingValue_(ev.data);
      if (v2 === null) {
        return;
      }
      this.value.setRawValue(v2, {
        forceEmit: true,
        last: true
      });
      this.dragging_.rawValue = null;
    }
  };
  var cn$g = ClassName("sld");
  var SliderView = class {
    constructor(doc, config) {
      this.onChange_ = this.onChange_.bind(this);
      this.props_ = config.props;
      this.props_.emitter.on("change", this.onChange_);
      this.element = doc.createElement("div");
      this.element.classList.add(cn$g());
      config.viewProps.bindClassModifiers(this.element);
      const trackElem = doc.createElement("div");
      trackElem.classList.add(cn$g("t"));
      config.viewProps.bindTabIndex(trackElem);
      this.element.appendChild(trackElem);
      this.trackElement = trackElem;
      const knobElem = doc.createElement("div");
      knobElem.classList.add(cn$g("k"));
      this.trackElement.appendChild(knobElem);
      this.knobElement = knobElem;
      config.value.emitter.on("change", this.onChange_);
      this.value = config.value;
      this.update_();
    }
    update_() {
      const p2 = constrainRange(mapRange(this.value.rawValue, this.props_.get("min"), this.props_.get("max"), 0, 100), 0, 100);
      this.knobElement.style.width = `${p2}%`;
    }
    onChange_() {
      this.update_();
    }
  };
  var SliderController = class {
    constructor(doc, config) {
      this.onKeyDown_ = this.onKeyDown_.bind(this);
      this.onKeyUp_ = this.onKeyUp_.bind(this);
      this.onPointerDownOrMove_ = this.onPointerDownOrMove_.bind(this);
      this.onPointerUp_ = this.onPointerUp_.bind(this);
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.props = config.props;
      this.view = new SliderView(doc, {
        props: this.props,
        value: this.value,
        viewProps: this.viewProps
      });
      this.ptHandler_ = new PointerHandler(this.view.trackElement);
      this.ptHandler_.emitter.on("down", this.onPointerDownOrMove_);
      this.ptHandler_.emitter.on("move", this.onPointerDownOrMove_);
      this.ptHandler_.emitter.on("up", this.onPointerUp_);
      this.view.trackElement.addEventListener("keydown", this.onKeyDown_);
      this.view.trackElement.addEventListener("keyup", this.onKeyUp_);
    }
    handlePointerEvent_(d2, opts) {
      if (!d2.point) {
        return;
      }
      this.value.setRawValue(mapRange(constrainRange(d2.point.x, 0, d2.bounds.width), 0, d2.bounds.width, this.props.get("min"), this.props.get("max")), opts);
    }
    onPointerDownOrMove_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: false,
        last: false
      });
    }
    onPointerUp_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: true,
        last: true
      });
    }
    onKeyDown_(ev) {
      const step = getStepForKey(this.props.get("keyScale"), getHorizontalStepKeys(ev));
      if (step === 0) {
        return;
      }
      this.value.setRawValue(this.value.rawValue + step, {
        forceEmit: false,
        last: false
      });
    }
    onKeyUp_(ev) {
      const step = getStepForKey(this.props.get("keyScale"), getHorizontalStepKeys(ev));
      if (step === 0) {
        return;
      }
      this.value.setRawValue(this.value.rawValue, {
        forceEmit: true,
        last: true
      });
    }
  };
  var cn$f = ClassName("sldtxt");
  var SliderTextView = class {
    constructor(doc, config) {
      this.element = doc.createElement("div");
      this.element.classList.add(cn$f());
      const sliderElem = doc.createElement("div");
      sliderElem.classList.add(cn$f("s"));
      this.sliderView_ = config.sliderView;
      sliderElem.appendChild(this.sliderView_.element);
      this.element.appendChild(sliderElem);
      const textElem = doc.createElement("div");
      textElem.classList.add(cn$f("t"));
      this.textView_ = config.textView;
      textElem.appendChild(this.textView_.element);
      this.element.appendChild(textElem);
    }
  };
  var SliderTextController = class {
    constructor(doc, config) {
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.sliderC_ = new SliderController(doc, {
        props: config.sliderProps,
        value: config.value,
        viewProps: this.viewProps
      });
      this.textC_ = new NumberTextController(doc, {
        parser: config.parser,
        props: config.textProps,
        sliderProps: config.sliderProps,
        value: config.value,
        viewProps: config.viewProps
      });
      this.view = new SliderTextView(doc, {
        sliderView: this.sliderC_.view,
        textView: this.textC_.view
      });
    }
    get sliderController() {
      return this.sliderC_;
    }
    get textController() {
      return this.textC_;
    }
    importProps(state) {
      return importBladeState(state, null, (p2) => ({
        max: p2.required.number,
        min: p2.required.number
      }), (result) => {
        const sliderProps = this.sliderC_.props;
        sliderProps.set("max", result.max);
        sliderProps.set("min", result.min);
        return true;
      });
    }
    exportProps() {
      const sliderProps = this.sliderC_.props;
      return exportBladeState(null, {
        max: sliderProps.get("max"),
        min: sliderProps.get("min")
      });
    }
  };
  function createSliderTextProps(config) {
    return {
      sliderProps: new ValueMap({
        keyScale: config.keyScale,
        max: config.max,
        min: config.min
      }),
      textProps: new ValueMap({
        formatter: createValue(config.formatter),
        keyScale: config.keyScale,
        pointerScale: createValue(config.pointerScale)
      })
    };
  }
  var CSS_VAR_MAP = {
    containerUnitSize: "cnt-usz"
  };
  function getCssVar(key) {
    return `--${CSS_VAR_MAP[key]}`;
  }
  function createPointDimensionParser(p2) {
    return createNumberTextInputParamsParser(p2);
  }
  function parsePointDimensionParams(value) {
    if (!isRecord(value)) {
      return void 0;
    }
    return parseRecord(value, createPointDimensionParser);
  }
  function createDimensionConstraint(params, initialValue) {
    if (!params) {
      return void 0;
    }
    const constraints = [];
    const cs = createStepConstraint(params, initialValue);
    if (cs) {
      constraints.push(cs);
    }
    const rs = createRangeConstraint(params);
    if (rs) {
      constraints.push(rs);
    }
    return new CompositeConstraint(constraints);
  }
  function parsePickerLayout(value) {
    if (value === "inline" || value === "popup") {
      return value;
    }
    return void 0;
  }
  function writePrimitive(target2, value) {
    target2.write(value);
  }
  var cn$e = ClassName("ckb");
  var CheckboxView = class {
    constructor(doc, config) {
      this.onValueChange_ = this.onValueChange_.bind(this);
      this.element = doc.createElement("div");
      this.element.classList.add(cn$e());
      config.viewProps.bindClassModifiers(this.element);
      const labelElem = doc.createElement("label");
      labelElem.classList.add(cn$e("l"));
      this.element.appendChild(labelElem);
      const inputElem = doc.createElement("input");
      inputElem.classList.add(cn$e("i"));
      inputElem.type = "checkbox";
      labelElem.appendChild(inputElem);
      this.inputElement = inputElem;
      config.viewProps.bindDisabled(this.inputElement);
      const wrapperElem = doc.createElement("div");
      wrapperElem.classList.add(cn$e("w"));
      labelElem.appendChild(wrapperElem);
      const markElem = createSvgIconElement(doc, "check");
      wrapperElem.appendChild(markElem);
      config.value.emitter.on("change", this.onValueChange_);
      this.value = config.value;
      this.update_();
    }
    update_() {
      this.inputElement.checked = this.value.rawValue;
    }
    onValueChange_() {
      this.update_();
    }
  };
  var CheckboxController = class {
    constructor(doc, config) {
      this.onInputChange_ = this.onInputChange_.bind(this);
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.view = new CheckboxView(doc, {
        value: this.value,
        viewProps: this.viewProps
      });
      this.view.inputElement.addEventListener("change", this.onInputChange_);
    }
    onInputChange_(e) {
      const inputElem = forceCast(e.currentTarget);
      this.value.rawValue = inputElem.checked;
    }
  };
  function createConstraint$6(params) {
    const constraints = [];
    const lc = createListConstraint(params.options);
    if (lc) {
      constraints.push(lc);
    }
    return new CompositeConstraint(constraints);
  }
  var BooleanInputPlugin = createPlugin({
    id: "input-bool",
    type: "input",
    accept: (value, params) => {
      if (typeof value !== "boolean") {
        return null;
      }
      const result = parseRecord(params, (p2) => ({
        options: p2.optional.custom(parseListOptions),
        readonly: p2.optional.constant(false)
      }));
      return result ? {
        initialValue: value,
        params: result
      } : null;
    },
    binding: {
      reader: (_args) => boolFromUnknown,
      constraint: (args) => createConstraint$6(args.params),
      writer: (_args) => writePrimitive
    },
    controller: (args) => {
      const doc = args.document;
      const value = args.value;
      const c2 = args.constraint;
      const lc = c2 && findConstraint(c2, ListConstraint);
      if (lc) {
        return new ListController(doc, {
          props: new ValueMap({
            options: lc.values.value("options")
          }),
          value,
          viewProps: args.viewProps
        });
      }
      return new CheckboxController(doc, {
        value,
        viewProps: args.viewProps
      });
    },
    api(args) {
      if (typeof args.controller.value.rawValue !== "boolean") {
        return null;
      }
      if (args.controller.valueController instanceof ListController) {
        return new ListInputBindingApi(args.controller);
      }
      return null;
    }
  });
  var cn$d = ClassName("col");
  var ColorView = class {
    constructor(doc, config) {
      this.element = doc.createElement("div");
      this.element.classList.add(cn$d());
      config.foldable.bindExpandedClass(this.element, cn$d(void 0, "expanded"));
      bindValueMap(config.foldable, "completed", valueToClassName(this.element, cn$d(void 0, "cpl")));
      const headElem = doc.createElement("div");
      headElem.classList.add(cn$d("h"));
      this.element.appendChild(headElem);
      const swatchElem = doc.createElement("div");
      swatchElem.classList.add(cn$d("s"));
      headElem.appendChild(swatchElem);
      this.swatchElement = swatchElem;
      const textElem = doc.createElement("div");
      textElem.classList.add(cn$d("t"));
      headElem.appendChild(textElem);
      this.textElement = textElem;
      if (config.pickerLayout === "inline") {
        const pickerElem = doc.createElement("div");
        pickerElem.classList.add(cn$d("p"));
        this.element.appendChild(pickerElem);
        this.pickerElement = pickerElem;
      } else {
        this.pickerElement = null;
      }
    }
  };
  function rgbToHslInt(r, g2, b2) {
    const rp = constrainRange(r / 255, 0, 1);
    const gp = constrainRange(g2 / 255, 0, 1);
    const bp = constrainRange(b2 / 255, 0, 1);
    const cmax = Math.max(rp, gp, bp);
    const cmin = Math.min(rp, gp, bp);
    const c2 = cmax - cmin;
    let h2 = 0;
    let s = 0;
    const l2 = (cmin + cmax) / 2;
    if (c2 !== 0) {
      s = c2 / (1 - Math.abs(cmax + cmin - 1));
      if (rp === cmax) {
        h2 = (gp - bp) / c2;
      } else if (gp === cmax) {
        h2 = 2 + (bp - rp) / c2;
      } else {
        h2 = 4 + (rp - gp) / c2;
      }
      h2 = h2 / 6 + (h2 < 0 ? 1 : 0);
    }
    return [h2 * 360, s * 100, l2 * 100];
  }
  function hslToRgbInt(h2, s, l2) {
    const hp = (h2 % 360 + 360) % 360;
    const sp = constrainRange(s / 100, 0, 1);
    const lp = constrainRange(l2 / 100, 0, 1);
    const c2 = (1 - Math.abs(2 * lp - 1)) * sp;
    const x2 = c2 * (1 - Math.abs(hp / 60 % 2 - 1));
    const m2 = lp - c2 / 2;
    let rp, gp, bp;
    if (hp >= 0 && hp < 60) {
      [rp, gp, bp] = [c2, x2, 0];
    } else if (hp >= 60 && hp < 120) {
      [rp, gp, bp] = [x2, c2, 0];
    } else if (hp >= 120 && hp < 180) {
      [rp, gp, bp] = [0, c2, x2];
    } else if (hp >= 180 && hp < 240) {
      [rp, gp, bp] = [0, x2, c2];
    } else if (hp >= 240 && hp < 300) {
      [rp, gp, bp] = [x2, 0, c2];
    } else {
      [rp, gp, bp] = [c2, 0, x2];
    }
    return [(rp + m2) * 255, (gp + m2) * 255, (bp + m2) * 255];
  }
  function rgbToHsvInt(r, g2, b2) {
    const rp = constrainRange(r / 255, 0, 1);
    const gp = constrainRange(g2 / 255, 0, 1);
    const bp = constrainRange(b2 / 255, 0, 1);
    const cmax = Math.max(rp, gp, bp);
    const cmin = Math.min(rp, gp, bp);
    const d2 = cmax - cmin;
    let h2;
    if (d2 === 0) {
      h2 = 0;
    } else if (cmax === rp) {
      h2 = 60 * (((gp - bp) / d2 % 6 + 6) % 6);
    } else if (cmax === gp) {
      h2 = 60 * ((bp - rp) / d2 + 2);
    } else {
      h2 = 60 * ((rp - gp) / d2 + 4);
    }
    const s = cmax === 0 ? 0 : d2 / cmax;
    const v2 = cmax;
    return [h2, s * 100, v2 * 100];
  }
  function hsvToRgbInt(h2, s, v2) {
    const hp = loopRange(h2, 360);
    const sp = constrainRange(s / 100, 0, 1);
    const vp = constrainRange(v2 / 100, 0, 1);
    const c2 = vp * sp;
    const x2 = c2 * (1 - Math.abs(hp / 60 % 2 - 1));
    const m2 = vp - c2;
    let rp, gp, bp;
    if (hp >= 0 && hp < 60) {
      [rp, gp, bp] = [c2, x2, 0];
    } else if (hp >= 60 && hp < 120) {
      [rp, gp, bp] = [x2, c2, 0];
    } else if (hp >= 120 && hp < 180) {
      [rp, gp, bp] = [0, c2, x2];
    } else if (hp >= 180 && hp < 240) {
      [rp, gp, bp] = [0, x2, c2];
    } else if (hp >= 240 && hp < 300) {
      [rp, gp, bp] = [x2, 0, c2];
    } else {
      [rp, gp, bp] = [c2, 0, x2];
    }
    return [(rp + m2) * 255, (gp + m2) * 255, (bp + m2) * 255];
  }
  function hslToHsvInt(h2, s, l2) {
    const sd = l2 + s * (100 - Math.abs(2 * l2 - 100)) / (2 * 100);
    return [
      h2,
      sd !== 0 ? s * (100 - Math.abs(2 * l2 - 100)) / sd : 0,
      l2 + s * (100 - Math.abs(2 * l2 - 100)) / (2 * 100)
    ];
  }
  function hsvToHslInt(h2, s, v2) {
    const sd = 100 - Math.abs(v2 * (200 - s) / 100 - 100);
    return [h2, sd !== 0 ? s * v2 / sd : 0, v2 * (200 - s) / (2 * 100)];
  }
  function removeAlphaComponent(comps) {
    return [comps[0], comps[1], comps[2]];
  }
  function appendAlphaComponent(comps, alpha) {
    return [comps[0], comps[1], comps[2], alpha];
  }
  var MODE_CONVERTER_MAP = {
    hsl: {
      hsl: (h2, s, l2) => [h2, s, l2],
      hsv: hslToHsvInt,
      rgb: hslToRgbInt
    },
    hsv: {
      hsl: hsvToHslInt,
      hsv: (h2, s, v2) => [h2, s, v2],
      rgb: hsvToRgbInt
    },
    rgb: {
      hsl: rgbToHslInt,
      hsv: rgbToHsvInt,
      rgb: (r, g2, b2) => [r, g2, b2]
    }
  };
  function getColorMaxComponents(mode, type) {
    return [
      type === "float" ? 1 : mode === "rgb" ? 255 : 360,
      type === "float" ? 1 : mode === "rgb" ? 255 : 100,
      type === "float" ? 1 : mode === "rgb" ? 255 : 100
    ];
  }
  function loopHueRange(hue, max) {
    return hue === max ? max : loopRange(hue, max);
  }
  function constrainColorComponents(components, mode, type) {
    var _a;
    const ms = getColorMaxComponents(mode, type);
    return [
      mode === "rgb" ? constrainRange(components[0], 0, ms[0]) : loopHueRange(components[0], ms[0]),
      constrainRange(components[1], 0, ms[1]),
      constrainRange(components[2], 0, ms[2]),
      constrainRange((_a = components[3]) !== null && _a !== void 0 ? _a : 1, 0, 1)
    ];
  }
  function convertColorType(comps, mode, from, to) {
    const fms = getColorMaxComponents(mode, from);
    const tms = getColorMaxComponents(mode, to);
    return comps.map((c2, index) => c2 / fms[index] * tms[index]);
  }
  function convertColor(components, from, to) {
    const intComps = convertColorType(components, from.mode, from.type, "int");
    const result = MODE_CONVERTER_MAP[from.mode][to.mode](...intComps);
    return convertColorType(result, to.mode, "int", to.type);
  }
  var IntColor = class {
    static black() {
      return new IntColor([0, 0, 0], "rgb");
    }
    constructor(comps, mode) {
      this.type = "int";
      this.mode = mode;
      this.comps_ = constrainColorComponents(comps, mode, this.type);
    }
    getComponents(opt_mode) {
      return appendAlphaComponent(convertColor(removeAlphaComponent(this.comps_), { mode: this.mode, type: this.type }, { mode: opt_mode !== null && opt_mode !== void 0 ? opt_mode : this.mode, type: this.type }), this.comps_[3]);
    }
    toRgbaObject() {
      const rgbComps = this.getComponents("rgb");
      return {
        r: rgbComps[0],
        g: rgbComps[1],
        b: rgbComps[2],
        a: rgbComps[3]
      };
    }
  };
  var cn$c = ClassName("colp");
  var ColorPickerView = class {
    constructor(doc, config) {
      this.alphaViews_ = null;
      this.element = doc.createElement("div");
      this.element.classList.add(cn$c());
      config.viewProps.bindClassModifiers(this.element);
      const hsvElem = doc.createElement("div");
      hsvElem.classList.add(cn$c("hsv"));
      const svElem = doc.createElement("div");
      svElem.classList.add(cn$c("sv"));
      this.svPaletteView_ = config.svPaletteView;
      svElem.appendChild(this.svPaletteView_.element);
      hsvElem.appendChild(svElem);
      const hElem = doc.createElement("div");
      hElem.classList.add(cn$c("h"));
      this.hPaletteView_ = config.hPaletteView;
      hElem.appendChild(this.hPaletteView_.element);
      hsvElem.appendChild(hElem);
      this.element.appendChild(hsvElem);
      const rgbElem = doc.createElement("div");
      rgbElem.classList.add(cn$c("rgb"));
      this.textsView_ = config.textsView;
      rgbElem.appendChild(this.textsView_.element);
      this.element.appendChild(rgbElem);
      if (config.alphaViews) {
        this.alphaViews_ = {
          palette: config.alphaViews.palette,
          text: config.alphaViews.text
        };
        const aElem = doc.createElement("div");
        aElem.classList.add(cn$c("a"));
        const apElem = doc.createElement("div");
        apElem.classList.add(cn$c("ap"));
        apElem.appendChild(this.alphaViews_.palette.element);
        aElem.appendChild(apElem);
        const atElem = doc.createElement("div");
        atElem.classList.add(cn$c("at"));
        atElem.appendChild(this.alphaViews_.text.element);
        aElem.appendChild(atElem);
        this.element.appendChild(aElem);
      }
    }
    get allFocusableElements() {
      const elems = [
        this.svPaletteView_.element,
        this.hPaletteView_.element,
        this.textsView_.modeSelectElement,
        ...this.textsView_.inputViews.map((v2) => v2.inputElement)
      ];
      if (this.alphaViews_) {
        elems.push(this.alphaViews_.palette.element, this.alphaViews_.text.inputElement);
      }
      return elems;
    }
  };
  function parseColorType(value) {
    return value === "int" ? "int" : value === "float" ? "float" : void 0;
  }
  function parseColorInputParams(params) {
    return parseRecord(params, (p2) => ({
      color: p2.optional.object({
        alpha: p2.optional.boolean,
        type: p2.optional.custom(parseColorType)
      }),
      expanded: p2.optional.boolean,
      picker: p2.optional.custom(parsePickerLayout),
      readonly: p2.optional.constant(false)
    }));
  }
  function getKeyScaleForColor(forAlpha) {
    return forAlpha ? 0.1 : 1;
  }
  function extractColorType(params) {
    var _a;
    return (_a = params.color) === null || _a === void 0 ? void 0 : _a.type;
  }
  var FloatColor = class {
    constructor(comps, mode) {
      this.type = "float";
      this.mode = mode;
      this.comps_ = constrainColorComponents(comps, mode, this.type);
    }
    getComponents(opt_mode) {
      return appendAlphaComponent(convertColor(removeAlphaComponent(this.comps_), { mode: this.mode, type: this.type }, { mode: opt_mode !== null && opt_mode !== void 0 ? opt_mode : this.mode, type: this.type }), this.comps_[3]);
    }
    toRgbaObject() {
      const rgbComps = this.getComponents("rgb");
      return {
        r: rgbComps[0],
        g: rgbComps[1],
        b: rgbComps[2],
        a: rgbComps[3]
      };
    }
  };
  var TYPE_TO_CONSTRUCTOR_MAP = {
    int: (comps, mode) => new IntColor(comps, mode),
    float: (comps, mode) => new FloatColor(comps, mode)
  };
  function createColor(comps, mode, type) {
    return TYPE_TO_CONSTRUCTOR_MAP[type](comps, mode);
  }
  function isFloatColor(c2) {
    return c2.type === "float";
  }
  function isIntColor(c2) {
    return c2.type === "int";
  }
  function convertFloatToInt(cf) {
    const comps = cf.getComponents();
    const ms = getColorMaxComponents(cf.mode, "int");
    return new IntColor([
      Math.round(mapRange(comps[0], 0, 1, 0, ms[0])),
      Math.round(mapRange(comps[1], 0, 1, 0, ms[1])),
      Math.round(mapRange(comps[2], 0, 1, 0, ms[2])),
      comps[3]
    ], cf.mode);
  }
  function convertIntToFloat(ci) {
    const comps = ci.getComponents();
    const ms = getColorMaxComponents(ci.mode, "int");
    return new FloatColor([
      mapRange(comps[0], 0, ms[0], 0, 1),
      mapRange(comps[1], 0, ms[1], 0, 1),
      mapRange(comps[2], 0, ms[2], 0, 1),
      comps[3]
    ], ci.mode);
  }
  function mapColorType(c2, type) {
    if (c2.type === type) {
      return c2;
    }
    if (isIntColor(c2) && type === "float") {
      return convertIntToFloat(c2);
    }
    if (isFloatColor(c2) && type === "int") {
      return convertFloatToInt(c2);
    }
    throw TpError.shouldNeverHappen();
  }
  function equalsStringColorFormat(f1, f2) {
    return f1.alpha === f2.alpha && f1.mode === f2.mode && f1.notation === f2.notation && f1.type === f2.type;
  }
  function parseCssNumberOrPercentage(text, max) {
    const m2 = text.match(/^(.+)%$/);
    if (!m2) {
      return Math.min(parseFloat(text), max);
    }
    return Math.min(parseFloat(m2[1]) * 0.01 * max, max);
  }
  var ANGLE_TO_DEG_MAP = {
    deg: (angle) => angle,
    grad: (angle) => angle * 360 / 400,
    rad: (angle) => angle * 360 / (2 * Math.PI),
    turn: (angle) => angle * 360
  };
  function parseCssNumberOrAngle(text) {
    const m2 = text.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);
    if (!m2) {
      return parseFloat(text);
    }
    const angle = parseFloat(m2[1]);
    const unit2 = m2[2];
    return ANGLE_TO_DEG_MAP[unit2](angle);
  }
  function parseFunctionalRgbColorComponents(text) {
    const m2 = text.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
    if (!m2) {
      return null;
    }
    const comps = [
      parseCssNumberOrPercentage(m2[1], 255),
      parseCssNumberOrPercentage(m2[2], 255),
      parseCssNumberOrPercentage(m2[3], 255)
    ];
    if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
      return null;
    }
    return comps;
  }
  function parseFunctionalRgbColor(text) {
    const comps = parseFunctionalRgbColorComponents(text);
    return comps ? new IntColor(comps, "rgb") : null;
  }
  function parseFunctionalRgbaColorComponents(text) {
    const m2 = text.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
    if (!m2) {
      return null;
    }
    const comps = [
      parseCssNumberOrPercentage(m2[1], 255),
      parseCssNumberOrPercentage(m2[2], 255),
      parseCssNumberOrPercentage(m2[3], 255),
      parseCssNumberOrPercentage(m2[4], 1)
    ];
    if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2]) || isNaN(comps[3])) {
      return null;
    }
    return comps;
  }
  function parseFunctionalRgbaColor(text) {
    const comps = parseFunctionalRgbaColorComponents(text);
    return comps ? new IntColor(comps, "rgb") : null;
  }
  function parseFunctionalHslColorComponents(text) {
    const m2 = text.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
    if (!m2) {
      return null;
    }
    const comps = [
      parseCssNumberOrAngle(m2[1]),
      parseCssNumberOrPercentage(m2[2], 100),
      parseCssNumberOrPercentage(m2[3], 100)
    ];
    if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
      return null;
    }
    return comps;
  }
  function parseFunctionalHslColor(text) {
    const comps = parseFunctionalHslColorComponents(text);
    return comps ? new IntColor(comps, "hsl") : null;
  }
  function parseHslaColorComponents(text) {
    const m2 = text.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
    if (!m2) {
      return null;
    }
    const comps = [
      parseCssNumberOrAngle(m2[1]),
      parseCssNumberOrPercentage(m2[2], 100),
      parseCssNumberOrPercentage(m2[3], 100),
      parseCssNumberOrPercentage(m2[4], 1)
    ];
    if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2]) || isNaN(comps[3])) {
      return null;
    }
    return comps;
  }
  function parseFunctionalHslaColor(text) {
    const comps = parseHslaColorComponents(text);
    return comps ? new IntColor(comps, "hsl") : null;
  }
  function parseHexRgbColorComponents(text) {
    const mRgb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
    if (mRgb) {
      return [
        parseInt(mRgb[1] + mRgb[1], 16),
        parseInt(mRgb[2] + mRgb[2], 16),
        parseInt(mRgb[3] + mRgb[3], 16)
      ];
    }
    const mRrggbb = text.match(/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
    if (mRrggbb) {
      return [
        parseInt(mRrggbb[1], 16),
        parseInt(mRrggbb[2], 16),
        parseInt(mRrggbb[3], 16)
      ];
    }
    return null;
  }
  function parseHexRgbColor(text) {
    const comps = parseHexRgbColorComponents(text);
    return comps ? new IntColor(comps, "rgb") : null;
  }
  function parseHexRgbaColorComponents(text) {
    const mRgb = text.match(/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
    if (mRgb) {
      return [
        parseInt(mRgb[1] + mRgb[1], 16),
        parseInt(mRgb[2] + mRgb[2], 16),
        parseInt(mRgb[3] + mRgb[3], 16),
        mapRange(parseInt(mRgb[4] + mRgb[4], 16), 0, 255, 0, 1)
      ];
    }
    const mRrggbb = text.match(/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
    if (mRrggbb) {
      return [
        parseInt(mRrggbb[1], 16),
        parseInt(mRrggbb[2], 16),
        parseInt(mRrggbb[3], 16),
        mapRange(parseInt(mRrggbb[4], 16), 0, 255, 0, 1)
      ];
    }
    return null;
  }
  function parseHexRgbaColor(text) {
    const comps = parseHexRgbaColorComponents(text);
    return comps ? new IntColor(comps, "rgb") : null;
  }
  function parseObjectRgbColorComponents(text) {
    const m2 = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
    if (!m2) {
      return null;
    }
    const comps = [
      parseFloat(m2[1]),
      parseFloat(m2[2]),
      parseFloat(m2[3])
    ];
    if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
      return null;
    }
    return comps;
  }
  function createObjectRgbColorParser(type) {
    return (text) => {
      const comps = parseObjectRgbColorComponents(text);
      return comps ? createColor(comps, "rgb", type) : null;
    };
  }
  function parseObjectRgbaColorComponents(text) {
    const m2 = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
    if (!m2) {
      return null;
    }
    const comps = [
      parseFloat(m2[1]),
      parseFloat(m2[2]),
      parseFloat(m2[3]),
      parseFloat(m2[4])
    ];
    if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2]) || isNaN(comps[3])) {
      return null;
    }
    return comps;
  }
  function createObjectRgbaColorParser(type) {
    return (text) => {
      const comps = parseObjectRgbaColorComponents(text);
      return comps ? createColor(comps, "rgb", type) : null;
    };
  }
  var PARSER_AND_RESULT = [
    {
      parser: parseHexRgbColorComponents,
      result: {
        alpha: false,
        mode: "rgb",
        notation: "hex"
      }
    },
    {
      parser: parseHexRgbaColorComponents,
      result: {
        alpha: true,
        mode: "rgb",
        notation: "hex"
      }
    },
    {
      parser: parseFunctionalRgbColorComponents,
      result: {
        alpha: false,
        mode: "rgb",
        notation: "func"
      }
    },
    {
      parser: parseFunctionalRgbaColorComponents,
      result: {
        alpha: true,
        mode: "rgb",
        notation: "func"
      }
    },
    {
      parser: parseFunctionalHslColorComponents,
      result: {
        alpha: false,
        mode: "hsl",
        notation: "func"
      }
    },
    {
      parser: parseHslaColorComponents,
      result: {
        alpha: true,
        mode: "hsl",
        notation: "func"
      }
    },
    {
      parser: parseObjectRgbColorComponents,
      result: {
        alpha: false,
        mode: "rgb",
        notation: "object"
      }
    },
    {
      parser: parseObjectRgbaColorComponents,
      result: {
        alpha: true,
        mode: "rgb",
        notation: "object"
      }
    }
  ];
  function detectStringColor(text) {
    return PARSER_AND_RESULT.reduce((prev, { parser, result: detection }) => {
      if (prev) {
        return prev;
      }
      return parser(text) ? detection : null;
    }, null);
  }
  function detectStringColorFormat(text, type = "int") {
    const r = detectStringColor(text);
    if (!r) {
      return null;
    }
    if (r.notation === "hex" && type !== "float") {
      return Object.assign(Object.assign({}, r), { type: "int" });
    }
    if (r.notation === "func") {
      return Object.assign(Object.assign({}, r), { type });
    }
    return null;
  }
  function createColorStringParser(type) {
    const parsers = [
      parseHexRgbColor,
      parseHexRgbaColor,
      parseFunctionalRgbColor,
      parseFunctionalRgbaColor,
      parseFunctionalHslColor,
      parseFunctionalHslaColor
    ];
    if (type === "int") {
      parsers.push(createObjectRgbColorParser("int"), createObjectRgbaColorParser("int"));
    }
    if (type === "float") {
      parsers.push(createObjectRgbColorParser("float"), createObjectRgbaColorParser("float"));
    }
    const parser = composeParsers(parsers);
    return (text) => {
      const result = parser(text);
      return result ? mapColorType(result, type) : null;
    };
  }
  function readIntColorString(value) {
    const parser = createColorStringParser("int");
    if (typeof value !== "string") {
      return IntColor.black();
    }
    const result = parser(value);
    return result !== null && result !== void 0 ? result : IntColor.black();
  }
  function zerofill(comp) {
    const hex = constrainRange(Math.floor(comp), 0, 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }
  function colorToHexRgbString(value, prefix = "#") {
    const hexes = removeAlphaComponent(value.getComponents("rgb")).map(zerofill).join("");
    return `${prefix}${hexes}`;
  }
  function colorToHexRgbaString(value, prefix = "#") {
    const rgbaComps = value.getComponents("rgb");
    const hexes = [rgbaComps[0], rgbaComps[1], rgbaComps[2], rgbaComps[3] * 255].map(zerofill).join("");
    return `${prefix}${hexes}`;
  }
  function colorToFunctionalRgbString(value) {
    const formatter = createNumberFormatter(0);
    const ci = mapColorType(value, "int");
    const comps = removeAlphaComponent(ci.getComponents("rgb")).map((comp) => formatter(comp));
    return `rgb(${comps.join(", ")})`;
  }
  function colorToFunctionalRgbaString(value) {
    const aFormatter = createNumberFormatter(2);
    const rgbFormatter = createNumberFormatter(0);
    const ci = mapColorType(value, "int");
    const comps = ci.getComponents("rgb").map((comp, index) => {
      const formatter = index === 3 ? aFormatter : rgbFormatter;
      return formatter(comp);
    });
    return `rgba(${comps.join(", ")})`;
  }
  function colorToFunctionalHslString(value) {
    const formatters = [
      createNumberFormatter(0),
      formatPercentage,
      formatPercentage
    ];
    const ci = mapColorType(value, "int");
    const comps = removeAlphaComponent(ci.getComponents("hsl")).map((comp, index) => formatters[index](comp));
    return `hsl(${comps.join(", ")})`;
  }
  function colorToFunctionalHslaString(value) {
    const formatters = [
      createNumberFormatter(0),
      formatPercentage,
      formatPercentage,
      createNumberFormatter(2)
    ];
    const ci = mapColorType(value, "int");
    const comps = ci.getComponents("hsl").map((comp, index) => formatters[index](comp));
    return `hsla(${comps.join(", ")})`;
  }
  function colorToObjectRgbString(value, type) {
    const formatter = createNumberFormatter(type === "float" ? 2 : 0);
    const names = ["r", "g", "b"];
    const cc = mapColorType(value, type);
    const comps = removeAlphaComponent(cc.getComponents("rgb")).map((comp, index) => `${names[index]}: ${formatter(comp)}`);
    return `{${comps.join(", ")}}`;
  }
  function createObjectRgbColorFormatter(type) {
    return (value) => colorToObjectRgbString(value, type);
  }
  function colorToObjectRgbaString(value, type) {
    const aFormatter = createNumberFormatter(2);
    const rgbFormatter = createNumberFormatter(type === "float" ? 2 : 0);
    const names = ["r", "g", "b", "a"];
    const cc = mapColorType(value, type);
    const comps = cc.getComponents("rgb").map((comp, index) => {
      const formatter = index === 3 ? aFormatter : rgbFormatter;
      return `${names[index]}: ${formatter(comp)}`;
    });
    return `{${comps.join(", ")}}`;
  }
  function createObjectRgbaColorFormatter(type) {
    return (value) => colorToObjectRgbaString(value, type);
  }
  var FORMAT_AND_STRINGIFIERS = [
    {
      format: {
        alpha: false,
        mode: "rgb",
        notation: "hex",
        type: "int"
      },
      stringifier: colorToHexRgbString
    },
    {
      format: {
        alpha: true,
        mode: "rgb",
        notation: "hex",
        type: "int"
      },
      stringifier: colorToHexRgbaString
    },
    {
      format: {
        alpha: false,
        mode: "rgb",
        notation: "func",
        type: "int"
      },
      stringifier: colorToFunctionalRgbString
    },
    {
      format: {
        alpha: true,
        mode: "rgb",
        notation: "func",
        type: "int"
      },
      stringifier: colorToFunctionalRgbaString
    },
    {
      format: {
        alpha: false,
        mode: "hsl",
        notation: "func",
        type: "int"
      },
      stringifier: colorToFunctionalHslString
    },
    {
      format: {
        alpha: true,
        mode: "hsl",
        notation: "func",
        type: "int"
      },
      stringifier: colorToFunctionalHslaString
    },
    ...["int", "float"].reduce((prev, type) => {
      return [
        ...prev,
        {
          format: {
            alpha: false,
            mode: "rgb",
            notation: "object",
            type
          },
          stringifier: createObjectRgbColorFormatter(type)
        },
        {
          format: {
            alpha: true,
            mode: "rgb",
            notation: "object",
            type
          },
          stringifier: createObjectRgbaColorFormatter(type)
        }
      ];
    }, [])
  ];
  function findColorStringifier(format) {
    return FORMAT_AND_STRINGIFIERS.reduce((prev, fas) => {
      if (prev) {
        return prev;
      }
      return equalsStringColorFormat(fas.format, format) ? fas.stringifier : null;
    }, null);
  }
  var cn$b = ClassName("apl");
  var APaletteView = class {
    constructor(doc, config) {
      this.onValueChange_ = this.onValueChange_.bind(this);
      this.value = config.value;
      this.value.emitter.on("change", this.onValueChange_);
      this.element = doc.createElement("div");
      this.element.classList.add(cn$b());
      config.viewProps.bindClassModifiers(this.element);
      config.viewProps.bindTabIndex(this.element);
      const barElem = doc.createElement("div");
      barElem.classList.add(cn$b("b"));
      this.element.appendChild(barElem);
      const colorElem = doc.createElement("div");
      colorElem.classList.add(cn$b("c"));
      barElem.appendChild(colorElem);
      this.colorElem_ = colorElem;
      const markerElem = doc.createElement("div");
      markerElem.classList.add(cn$b("m"));
      this.element.appendChild(markerElem);
      this.markerElem_ = markerElem;
      const previewElem = doc.createElement("div");
      previewElem.classList.add(cn$b("p"));
      this.markerElem_.appendChild(previewElem);
      this.previewElem_ = previewElem;
      this.update_();
    }
    update_() {
      const c2 = this.value.rawValue;
      const rgbaComps = c2.getComponents("rgb");
      const leftColor = new IntColor([rgbaComps[0], rgbaComps[1], rgbaComps[2], 0], "rgb");
      const rightColor = new IntColor([rgbaComps[0], rgbaComps[1], rgbaComps[2], 255], "rgb");
      const gradientComps = [
        "to right",
        colorToFunctionalRgbaString(leftColor),
        colorToFunctionalRgbaString(rightColor)
      ];
      this.colorElem_.style.background = `linear-gradient(${gradientComps.join(",")})`;
      this.previewElem_.style.backgroundColor = colorToFunctionalRgbaString(c2);
      const left = mapRange(rgbaComps[3], 0, 1, 0, 100);
      this.markerElem_.style.left = `${left}%`;
    }
    onValueChange_() {
      this.update_();
    }
  };
  var APaletteController = class {
    constructor(doc, config) {
      this.onKeyDown_ = this.onKeyDown_.bind(this);
      this.onKeyUp_ = this.onKeyUp_.bind(this);
      this.onPointerDown_ = this.onPointerDown_.bind(this);
      this.onPointerMove_ = this.onPointerMove_.bind(this);
      this.onPointerUp_ = this.onPointerUp_.bind(this);
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.view = new APaletteView(doc, {
        value: this.value,
        viewProps: this.viewProps
      });
      this.ptHandler_ = new PointerHandler(this.view.element);
      this.ptHandler_.emitter.on("down", this.onPointerDown_);
      this.ptHandler_.emitter.on("move", this.onPointerMove_);
      this.ptHandler_.emitter.on("up", this.onPointerUp_);
      this.view.element.addEventListener("keydown", this.onKeyDown_);
      this.view.element.addEventListener("keyup", this.onKeyUp_);
    }
    handlePointerEvent_(d2, opts) {
      if (!d2.point) {
        return;
      }
      const alpha = d2.point.x / d2.bounds.width;
      const c2 = this.value.rawValue;
      const [h2, s, v2] = c2.getComponents("hsv");
      this.value.setRawValue(new IntColor([h2, s, v2, alpha], "hsv"), opts);
    }
    onPointerDown_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: false,
        last: false
      });
    }
    onPointerMove_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: false,
        last: false
      });
    }
    onPointerUp_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: true,
        last: true
      });
    }
    onKeyDown_(ev) {
      const step = getStepForKey(getKeyScaleForColor(true), getHorizontalStepKeys(ev));
      if (step === 0) {
        return;
      }
      const c2 = this.value.rawValue;
      const [h2, s, v2, a] = c2.getComponents("hsv");
      this.value.setRawValue(new IntColor([h2, s, v2, a + step], "hsv"), {
        forceEmit: false,
        last: false
      });
    }
    onKeyUp_(ev) {
      const step = getStepForKey(getKeyScaleForColor(true), getHorizontalStepKeys(ev));
      if (step === 0) {
        return;
      }
      this.value.setRawValue(this.value.rawValue, {
        forceEmit: true,
        last: true
      });
    }
  };
  var cn$a = ClassName("coltxt");
  function createModeSelectElement(doc) {
    const selectElem = doc.createElement("select");
    const items = [
      { text: "RGB", value: "rgb" },
      { text: "HSL", value: "hsl" },
      { text: "HSV", value: "hsv" },
      { text: "HEX", value: "hex" }
    ];
    selectElem.appendChild(items.reduce((frag, item) => {
      const optElem = doc.createElement("option");
      optElem.textContent = item.text;
      optElem.value = item.value;
      frag.appendChild(optElem);
      return frag;
    }, doc.createDocumentFragment()));
    return selectElem;
  }
  var ColorTextsView = class {
    constructor(doc, config) {
      this.element = doc.createElement("div");
      this.element.classList.add(cn$a());
      config.viewProps.bindClassModifiers(this.element);
      const modeElem = doc.createElement("div");
      modeElem.classList.add(cn$a("m"));
      this.modeElem_ = createModeSelectElement(doc);
      this.modeElem_.classList.add(cn$a("ms"));
      modeElem.appendChild(this.modeSelectElement);
      config.viewProps.bindDisabled(this.modeElem_);
      const modeMarkerElem = doc.createElement("div");
      modeMarkerElem.classList.add(cn$a("mm"));
      modeMarkerElem.appendChild(createSvgIconElement(doc, "dropdown"));
      modeElem.appendChild(modeMarkerElem);
      this.element.appendChild(modeElem);
      const inputsElem = doc.createElement("div");
      inputsElem.classList.add(cn$a("w"));
      this.element.appendChild(inputsElem);
      this.inputsElem_ = inputsElem;
      this.inputViews_ = config.inputViews;
      this.applyInputViews_();
      bindValue(config.mode, (mode) => {
        this.modeElem_.value = mode;
      });
    }
    get modeSelectElement() {
      return this.modeElem_;
    }
    get inputViews() {
      return this.inputViews_;
    }
    set inputViews(inputViews) {
      this.inputViews_ = inputViews;
      this.applyInputViews_();
    }
    applyInputViews_() {
      removeChildElements(this.inputsElem_);
      const doc = this.element.ownerDocument;
      this.inputViews_.forEach((v2) => {
        const compElem = doc.createElement("div");
        compElem.classList.add(cn$a("c"));
        compElem.appendChild(v2.element);
        this.inputsElem_.appendChild(compElem);
      });
    }
  };
  function createFormatter$2(type) {
    return createNumberFormatter(type === "float" ? 2 : 0);
  }
  function createConstraint$5(mode, type, index) {
    const max = getColorMaxComponents(mode, type)[index];
    return new DefiniteRangeConstraint({
      min: 0,
      max
    });
  }
  function createComponentController(doc, config, index) {
    return new NumberTextController(doc, {
      arrayPosition: index === 0 ? "fst" : index === 3 - 1 ? "lst" : "mid",
      parser: config.parser,
      props: ValueMap.fromObject({
        formatter: createFormatter$2(config.colorType),
        keyScale: getKeyScaleForColor(false),
        pointerScale: config.colorType === "float" ? 0.01 : 1
      }),
      value: createValue(0, {
        constraint: createConstraint$5(config.colorMode, config.colorType, index)
      }),
      viewProps: config.viewProps
    });
  }
  function createComponentControllers(doc, config) {
    const cc = {
      colorMode: config.colorMode,
      colorType: config.colorType,
      parser: parseNumber,
      viewProps: config.viewProps
    };
    return [0, 1, 2].map((i) => {
      const c2 = createComponentController(doc, cc, i);
      connectValues({
        primary: config.value,
        secondary: c2.value,
        forward(p2) {
          const mc = mapColorType(p2, config.colorType);
          return mc.getComponents(config.colorMode)[i];
        },
        backward(p2, s) {
          const pickedMode = config.colorMode;
          const mc = mapColorType(p2, config.colorType);
          const comps = mc.getComponents(pickedMode);
          comps[i] = s;
          const c3 = createColor(appendAlphaComponent(removeAlphaComponent(comps), comps[3]), pickedMode, config.colorType);
          return mapColorType(c3, "int");
        }
      });
      return c2;
    });
  }
  function createHexController(doc, config) {
    const c2 = new TextController(doc, {
      parser: createColorStringParser("int"),
      props: ValueMap.fromObject({
        formatter: colorToHexRgbString
      }),
      value: createValue(IntColor.black()),
      viewProps: config.viewProps
    });
    connectValues({
      primary: config.value,
      secondary: c2.value,
      forward: (p2) => new IntColor(removeAlphaComponent(p2.getComponents()), p2.mode),
      backward: (p2, s) => new IntColor(appendAlphaComponent(removeAlphaComponent(s.getComponents(p2.mode)), p2.getComponents()[3]), p2.mode)
    });
    return [c2];
  }
  function isColorMode(mode) {
    return mode !== "hex";
  }
  var ColorTextsController = class {
    constructor(doc, config) {
      this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);
      this.colorType_ = config.colorType;
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.colorMode = createValue(this.value.rawValue.mode);
      this.ccs_ = this.createComponentControllers_(doc);
      this.view = new ColorTextsView(doc, {
        mode: this.colorMode,
        inputViews: [this.ccs_[0].view, this.ccs_[1].view, this.ccs_[2].view],
        viewProps: this.viewProps
      });
      this.view.modeSelectElement.addEventListener("change", this.onModeSelectChange_);
    }
    createComponentControllers_(doc) {
      const mode = this.colorMode.rawValue;
      if (isColorMode(mode)) {
        return createComponentControllers(doc, {
          colorMode: mode,
          colorType: this.colorType_,
          value: this.value,
          viewProps: this.viewProps
        });
      }
      return createHexController(doc, {
        value: this.value,
        viewProps: this.viewProps
      });
    }
    onModeSelectChange_(ev) {
      const selectElem = ev.currentTarget;
      this.colorMode.rawValue = selectElem.value;
      this.ccs_ = this.createComponentControllers_(this.view.element.ownerDocument);
      this.view.inputViews = this.ccs_.map((cc) => cc.view);
    }
  };
  var cn$9 = ClassName("hpl");
  var HPaletteView = class {
    constructor(doc, config) {
      this.onValueChange_ = this.onValueChange_.bind(this);
      this.value = config.value;
      this.value.emitter.on("change", this.onValueChange_);
      this.element = doc.createElement("div");
      this.element.classList.add(cn$9());
      config.viewProps.bindClassModifiers(this.element);
      config.viewProps.bindTabIndex(this.element);
      const colorElem = doc.createElement("div");
      colorElem.classList.add(cn$9("c"));
      this.element.appendChild(colorElem);
      const markerElem = doc.createElement("div");
      markerElem.classList.add(cn$9("m"));
      this.element.appendChild(markerElem);
      this.markerElem_ = markerElem;
      this.update_();
    }
    update_() {
      const c2 = this.value.rawValue;
      const [h2] = c2.getComponents("hsv");
      this.markerElem_.style.backgroundColor = colorToFunctionalRgbString(new IntColor([h2, 100, 100], "hsv"));
      const left = mapRange(h2, 0, 360, 0, 100);
      this.markerElem_.style.left = `${left}%`;
    }
    onValueChange_() {
      this.update_();
    }
  };
  var HPaletteController = class {
    constructor(doc, config) {
      this.onKeyDown_ = this.onKeyDown_.bind(this);
      this.onKeyUp_ = this.onKeyUp_.bind(this);
      this.onPointerDown_ = this.onPointerDown_.bind(this);
      this.onPointerMove_ = this.onPointerMove_.bind(this);
      this.onPointerUp_ = this.onPointerUp_.bind(this);
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.view = new HPaletteView(doc, {
        value: this.value,
        viewProps: this.viewProps
      });
      this.ptHandler_ = new PointerHandler(this.view.element);
      this.ptHandler_.emitter.on("down", this.onPointerDown_);
      this.ptHandler_.emitter.on("move", this.onPointerMove_);
      this.ptHandler_.emitter.on("up", this.onPointerUp_);
      this.view.element.addEventListener("keydown", this.onKeyDown_);
      this.view.element.addEventListener("keyup", this.onKeyUp_);
    }
    handlePointerEvent_(d2, opts) {
      if (!d2.point) {
        return;
      }
      const hue = mapRange(constrainRange(d2.point.x, 0, d2.bounds.width), 0, d2.bounds.width, 0, 360);
      const c2 = this.value.rawValue;
      const [, s, v2, a] = c2.getComponents("hsv");
      this.value.setRawValue(new IntColor([hue, s, v2, a], "hsv"), opts);
    }
    onPointerDown_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: false,
        last: false
      });
    }
    onPointerMove_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: false,
        last: false
      });
    }
    onPointerUp_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: true,
        last: true
      });
    }
    onKeyDown_(ev) {
      const step = getStepForKey(getKeyScaleForColor(false), getHorizontalStepKeys(ev));
      if (step === 0) {
        return;
      }
      const c2 = this.value.rawValue;
      const [h2, s, v2, a] = c2.getComponents("hsv");
      this.value.setRawValue(new IntColor([h2 + step, s, v2, a], "hsv"), {
        forceEmit: false,
        last: false
      });
    }
    onKeyUp_(ev) {
      const step = getStepForKey(getKeyScaleForColor(false), getHorizontalStepKeys(ev));
      if (step === 0) {
        return;
      }
      this.value.setRawValue(this.value.rawValue, {
        forceEmit: true,
        last: true
      });
    }
  };
  var cn$8 = ClassName("svp");
  var CANVAS_RESOL = 64;
  var SvPaletteView = class {
    constructor(doc, config) {
      this.onValueChange_ = this.onValueChange_.bind(this);
      this.value = config.value;
      this.value.emitter.on("change", this.onValueChange_);
      this.element = doc.createElement("div");
      this.element.classList.add(cn$8());
      config.viewProps.bindClassModifiers(this.element);
      config.viewProps.bindTabIndex(this.element);
      const canvasElem = doc.createElement("canvas");
      canvasElem.height = CANVAS_RESOL;
      canvasElem.width = CANVAS_RESOL;
      canvasElem.classList.add(cn$8("c"));
      this.element.appendChild(canvasElem);
      this.canvasElement = canvasElem;
      const markerElem = doc.createElement("div");
      markerElem.classList.add(cn$8("m"));
      this.element.appendChild(markerElem);
      this.markerElem_ = markerElem;
      this.update_();
    }
    update_() {
      const ctx = getCanvasContext(this.canvasElement);
      if (!ctx) {
        return;
      }
      const c2 = this.value.rawValue;
      const hsvComps = c2.getComponents("hsv");
      const width = this.canvasElement.width;
      const height = this.canvasElement.height;
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let iy = 0; iy < height; iy++) {
        for (let ix = 0; ix < width; ix++) {
          const s = mapRange(ix, 0, width, 0, 100);
          const v2 = mapRange(iy, 0, height, 100, 0);
          const rgbComps = hsvToRgbInt(hsvComps[0], s, v2);
          const i = (iy * width + ix) * 4;
          data[i] = rgbComps[0];
          data[i + 1] = rgbComps[1];
          data[i + 2] = rgbComps[2];
          data[i + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      const left = mapRange(hsvComps[1], 0, 100, 0, 100);
      this.markerElem_.style.left = `${left}%`;
      const top = mapRange(hsvComps[2], 0, 100, 100, 0);
      this.markerElem_.style.top = `${top}%`;
    }
    onValueChange_() {
      this.update_();
    }
  };
  var SvPaletteController = class {
    constructor(doc, config) {
      this.onKeyDown_ = this.onKeyDown_.bind(this);
      this.onKeyUp_ = this.onKeyUp_.bind(this);
      this.onPointerDown_ = this.onPointerDown_.bind(this);
      this.onPointerMove_ = this.onPointerMove_.bind(this);
      this.onPointerUp_ = this.onPointerUp_.bind(this);
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.view = new SvPaletteView(doc, {
        value: this.value,
        viewProps: this.viewProps
      });
      this.ptHandler_ = new PointerHandler(this.view.element);
      this.ptHandler_.emitter.on("down", this.onPointerDown_);
      this.ptHandler_.emitter.on("move", this.onPointerMove_);
      this.ptHandler_.emitter.on("up", this.onPointerUp_);
      this.view.element.addEventListener("keydown", this.onKeyDown_);
      this.view.element.addEventListener("keyup", this.onKeyUp_);
    }
    handlePointerEvent_(d2, opts) {
      if (!d2.point) {
        return;
      }
      const saturation = mapRange(d2.point.x, 0, d2.bounds.width, 0, 100);
      const value = mapRange(d2.point.y, 0, d2.bounds.height, 100, 0);
      const [h2, , , a] = this.value.rawValue.getComponents("hsv");
      this.value.setRawValue(new IntColor([h2, saturation, value, a], "hsv"), opts);
    }
    onPointerDown_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: false,
        last: false
      });
    }
    onPointerMove_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: false,
        last: false
      });
    }
    onPointerUp_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: true,
        last: true
      });
    }
    onKeyDown_(ev) {
      if (isArrowKey(ev.key)) {
        ev.preventDefault();
      }
      const [h2, s, v2, a] = this.value.rawValue.getComponents("hsv");
      const keyScale = getKeyScaleForColor(false);
      const ds = getStepForKey(keyScale, getHorizontalStepKeys(ev));
      const dv = getStepForKey(keyScale, getVerticalStepKeys(ev));
      if (ds === 0 && dv === 0) {
        return;
      }
      this.value.setRawValue(new IntColor([h2, s + ds, v2 + dv, a], "hsv"), {
        forceEmit: false,
        last: false
      });
    }
    onKeyUp_(ev) {
      const keyScale = getKeyScaleForColor(false);
      const ds = getStepForKey(keyScale, getHorizontalStepKeys(ev));
      const dv = getStepForKey(keyScale, getVerticalStepKeys(ev));
      if (ds === 0 && dv === 0) {
        return;
      }
      this.value.setRawValue(this.value.rawValue, {
        forceEmit: true,
        last: true
      });
    }
  };
  var ColorPickerController = class {
    constructor(doc, config) {
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.hPaletteC_ = new HPaletteController(doc, {
        value: this.value,
        viewProps: this.viewProps
      });
      this.svPaletteC_ = new SvPaletteController(doc, {
        value: this.value,
        viewProps: this.viewProps
      });
      this.alphaIcs_ = config.supportsAlpha ? {
        palette: new APaletteController(doc, {
          value: this.value,
          viewProps: this.viewProps
        }),
        text: new NumberTextController(doc, {
          parser: parseNumber,
          props: ValueMap.fromObject({
            pointerScale: 0.01,
            keyScale: 0.1,
            formatter: createNumberFormatter(2)
          }),
          value: createValue(0, {
            constraint: new DefiniteRangeConstraint({ min: 0, max: 1 })
          }),
          viewProps: this.viewProps
        })
      } : null;
      if (this.alphaIcs_) {
        connectValues({
          primary: this.value,
          secondary: this.alphaIcs_.text.value,
          forward: (p2) => p2.getComponents()[3],
          backward: (p2, s) => {
            const comps = p2.getComponents();
            comps[3] = s;
            return new IntColor(comps, p2.mode);
          }
        });
      }
      this.textsC_ = new ColorTextsController(doc, {
        colorType: config.colorType,
        value: this.value,
        viewProps: this.viewProps
      });
      this.view = new ColorPickerView(doc, {
        alphaViews: this.alphaIcs_ ? {
          palette: this.alphaIcs_.palette.view,
          text: this.alphaIcs_.text.view
        } : null,
        hPaletteView: this.hPaletteC_.view,
        supportsAlpha: config.supportsAlpha,
        svPaletteView: this.svPaletteC_.view,
        textsView: this.textsC_.view,
        viewProps: this.viewProps
      });
    }
    get textsController() {
      return this.textsC_;
    }
  };
  var cn$7 = ClassName("colsw");
  var ColorSwatchView = class {
    constructor(doc, config) {
      this.onValueChange_ = this.onValueChange_.bind(this);
      config.value.emitter.on("change", this.onValueChange_);
      this.value = config.value;
      this.element = doc.createElement("div");
      this.element.classList.add(cn$7());
      config.viewProps.bindClassModifiers(this.element);
      const swatchElem = doc.createElement("div");
      swatchElem.classList.add(cn$7("sw"));
      this.element.appendChild(swatchElem);
      this.swatchElem_ = swatchElem;
      const buttonElem = doc.createElement("button");
      buttonElem.classList.add(cn$7("b"));
      config.viewProps.bindDisabled(buttonElem);
      this.element.appendChild(buttonElem);
      this.buttonElement = buttonElem;
      this.update_();
    }
    update_() {
      const value = this.value.rawValue;
      this.swatchElem_.style.backgroundColor = colorToHexRgbaString(value);
    }
    onValueChange_() {
      this.update_();
    }
  };
  var ColorSwatchController = class {
    constructor(doc, config) {
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.view = new ColorSwatchView(doc, {
        value: this.value,
        viewProps: this.viewProps
      });
    }
  };
  var ColorController = class {
    constructor(doc, config) {
      this.onButtonBlur_ = this.onButtonBlur_.bind(this);
      this.onButtonClick_ = this.onButtonClick_.bind(this);
      this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
      this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.foldable_ = Foldable.create(config.expanded);
      this.swatchC_ = new ColorSwatchController(doc, {
        value: this.value,
        viewProps: this.viewProps
      });
      const buttonElem = this.swatchC_.view.buttonElement;
      buttonElem.addEventListener("blur", this.onButtonBlur_);
      buttonElem.addEventListener("click", this.onButtonClick_);
      this.textC_ = new TextController(doc, {
        parser: config.parser,
        props: ValueMap.fromObject({
          formatter: config.formatter
        }),
        value: this.value,
        viewProps: this.viewProps
      });
      this.view = new ColorView(doc, {
        foldable: this.foldable_,
        pickerLayout: config.pickerLayout
      });
      this.view.swatchElement.appendChild(this.swatchC_.view.element);
      this.view.textElement.appendChild(this.textC_.view.element);
      this.popC_ = config.pickerLayout === "popup" ? new PopupController(doc, {
        viewProps: this.viewProps
      }) : null;
      const pickerC = new ColorPickerController(doc, {
        colorType: config.colorType,
        supportsAlpha: config.supportsAlpha,
        value: this.value,
        viewProps: this.viewProps
      });
      pickerC.view.allFocusableElements.forEach((elem) => {
        elem.addEventListener("blur", this.onPopupChildBlur_);
        elem.addEventListener("keydown", this.onPopupChildKeydown_);
      });
      this.pickerC_ = pickerC;
      if (this.popC_) {
        this.view.element.appendChild(this.popC_.view.element);
        this.popC_.view.element.appendChild(pickerC.view.element);
        connectValues({
          primary: this.foldable_.value("expanded"),
          secondary: this.popC_.shows,
          forward: (p2) => p2,
          backward: (_2, s) => s
        });
      } else if (this.view.pickerElement) {
        this.view.pickerElement.appendChild(this.pickerC_.view.element);
        bindFoldable(this.foldable_, this.view.pickerElement);
      }
    }
    get textController() {
      return this.textC_;
    }
    onButtonBlur_(e) {
      if (!this.popC_) {
        return;
      }
      const elem = this.view.element;
      const nextTarget = forceCast(e.relatedTarget);
      if (!nextTarget || !elem.contains(nextTarget)) {
        this.popC_.shows.rawValue = false;
      }
    }
    onButtonClick_() {
      this.foldable_.set("expanded", !this.foldable_.get("expanded"));
      if (this.foldable_.get("expanded")) {
        this.pickerC_.view.allFocusableElements[0].focus();
      }
    }
    onPopupChildBlur_(ev) {
      if (!this.popC_) {
        return;
      }
      const elem = this.popC_.view.element;
      const nextTarget = findNextTarget(ev);
      if (nextTarget && elem.contains(nextTarget)) {
        return;
      }
      if (nextTarget && nextTarget === this.swatchC_.view.buttonElement && !supportsTouch(elem.ownerDocument)) {
        return;
      }
      this.popC_.shows.rawValue = false;
    }
    onPopupChildKeydown_(ev) {
      if (this.popC_) {
        if (ev.key === "Escape") {
          this.popC_.shows.rawValue = false;
        }
      } else if (this.view.pickerElement) {
        if (ev.key === "Escape") {
          this.swatchC_.view.buttonElement.focus();
        }
      }
    }
  };
  function colorToRgbNumber(value) {
    return removeAlphaComponent(value.getComponents("rgb")).reduce((result, comp) => {
      return result << 8 | Math.floor(comp) & 255;
    }, 0);
  }
  function colorToRgbaNumber(value) {
    return value.getComponents("rgb").reduce((result, comp, index) => {
      const hex = Math.floor(index === 3 ? comp * 255 : comp) & 255;
      return result << 8 | hex;
    }, 0) >>> 0;
  }
  function numberToRgbColor(num) {
    return new IntColor([num >> 16 & 255, num >> 8 & 255, num & 255], "rgb");
  }
  function numberToRgbaColor(num) {
    return new IntColor([
      num >> 24 & 255,
      num >> 16 & 255,
      num >> 8 & 255,
      mapRange(num & 255, 0, 255, 0, 1)
    ], "rgb");
  }
  function colorFromRgbNumber(value) {
    if (typeof value !== "number") {
      return IntColor.black();
    }
    return numberToRgbColor(value);
  }
  function colorFromRgbaNumber(value) {
    if (typeof value !== "number") {
      return IntColor.black();
    }
    return numberToRgbaColor(value);
  }
  function isRgbColorComponent(obj, key) {
    if (typeof obj !== "object" || isEmpty(obj)) {
      return false;
    }
    return key in obj && typeof obj[key] === "number";
  }
  function isRgbColorObject(obj) {
    return isRgbColorComponent(obj, "r") && isRgbColorComponent(obj, "g") && isRgbColorComponent(obj, "b");
  }
  function isRgbaColorObject(obj) {
    return isRgbColorObject(obj) && isRgbColorComponent(obj, "a");
  }
  function isColorObject(obj) {
    return isRgbColorObject(obj);
  }
  function equalsColor(v1, v2) {
    if (v1.mode !== v2.mode) {
      return false;
    }
    if (v1.type !== v2.type) {
      return false;
    }
    const comps1 = v1.getComponents();
    const comps2 = v2.getComponents();
    for (let i = 0; i < comps1.length; i++) {
      if (comps1[i] !== comps2[i]) {
        return false;
      }
    }
    return true;
  }
  function createColorComponentsFromRgbObject(obj) {
    return "a" in obj ? [obj.r, obj.g, obj.b, obj.a] : [obj.r, obj.g, obj.b];
  }
  function createColorStringWriter(format) {
    const stringify = findColorStringifier(format);
    return stringify ? (target2, value) => {
      writePrimitive(target2, stringify(value));
    } : null;
  }
  function createColorNumberWriter(supportsAlpha) {
    const colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
    return (target2, value) => {
      writePrimitive(target2, colorToNumber(value));
    };
  }
  function writeRgbaColorObject(target2, value, type) {
    const cc = mapColorType(value, type);
    const obj = cc.toRgbaObject();
    target2.writeProperty("r", obj.r);
    target2.writeProperty("g", obj.g);
    target2.writeProperty("b", obj.b);
    target2.writeProperty("a", obj.a);
  }
  function writeRgbColorObject(target2, value, type) {
    const cc = mapColorType(value, type);
    const obj = cc.toRgbaObject();
    target2.writeProperty("r", obj.r);
    target2.writeProperty("g", obj.g);
    target2.writeProperty("b", obj.b);
  }
  function createColorObjectWriter(supportsAlpha, type) {
    return (target2, inValue) => {
      if (supportsAlpha) {
        writeRgbaColorObject(target2, inValue, type);
      } else {
        writeRgbColorObject(target2, inValue, type);
      }
    };
  }
  function shouldSupportAlpha$1(inputParams) {
    var _a;
    if ((_a = inputParams === null || inputParams === void 0 ? void 0 : inputParams.color) === null || _a === void 0 ? void 0 : _a.alpha) {
      return true;
    }
    return false;
  }
  function createFormatter$1(supportsAlpha) {
    return supportsAlpha ? (v2) => colorToHexRgbaString(v2, "0x") : (v2) => colorToHexRgbString(v2, "0x");
  }
  function isForColor(params) {
    if ("color" in params) {
      return true;
    }
    if (params.view === "color") {
      return true;
    }
    return false;
  }
  var NumberColorInputPlugin = createPlugin({
    id: "input-color-number",
    type: "input",
    accept: (value, params) => {
      if (typeof value !== "number") {
        return null;
      }
      if (!isForColor(params)) {
        return null;
      }
      const result = parseColorInputParams(params);
      return result ? {
        initialValue: value,
        params: Object.assign(Object.assign({}, result), { supportsAlpha: shouldSupportAlpha$1(params) })
      } : null;
    },
    binding: {
      reader: (args) => {
        return args.params.supportsAlpha ? colorFromRgbaNumber : colorFromRgbNumber;
      },
      equals: equalsColor,
      writer: (args) => {
        return createColorNumberWriter(args.params.supportsAlpha);
      }
    },
    controller: (args) => {
      var _a, _b;
      return new ColorController(args.document, {
        colorType: "int",
        expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
        formatter: createFormatter$1(args.params.supportsAlpha),
        parser: createColorStringParser("int"),
        pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : "popup",
        supportsAlpha: args.params.supportsAlpha,
        value: args.value,
        viewProps: args.viewProps
      });
    }
  });
  function colorFromObject(value, type) {
    if (!isColorObject(value)) {
      return mapColorType(IntColor.black(), type);
    }
    if (type === "int") {
      const comps = createColorComponentsFromRgbObject(value);
      return new IntColor(comps, "rgb");
    }
    if (type === "float") {
      const comps = createColorComponentsFromRgbObject(value);
      return new FloatColor(comps, "rgb");
    }
    return mapColorType(IntColor.black(), "int");
  }
  function shouldSupportAlpha(initialValue) {
    return isRgbaColorObject(initialValue);
  }
  function createColorObjectBindingReader(type) {
    return (value) => {
      const c2 = colorFromObject(value, type);
      return mapColorType(c2, "int");
    };
  }
  function createColorObjectFormatter(supportsAlpha, type) {
    return (value) => {
      if (supportsAlpha) {
        return colorToObjectRgbaString(value, type);
      }
      return colorToObjectRgbString(value, type);
    };
  }
  var ObjectColorInputPlugin = createPlugin({
    id: "input-color-object",
    type: "input",
    accept: (value, params) => {
      var _a;
      if (!isColorObject(value)) {
        return null;
      }
      const result = parseColorInputParams(params);
      return result ? {
        initialValue: value,
        params: Object.assign(Object.assign({}, result), { colorType: (_a = extractColorType(params)) !== null && _a !== void 0 ? _a : "int" })
      } : null;
    },
    binding: {
      reader: (args) => createColorObjectBindingReader(args.params.colorType),
      equals: equalsColor,
      writer: (args) => createColorObjectWriter(shouldSupportAlpha(args.initialValue), args.params.colorType)
    },
    controller: (args) => {
      var _a, _b;
      const supportsAlpha = isRgbaColorObject(args.initialValue);
      return new ColorController(args.document, {
        colorType: args.params.colorType,
        expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
        formatter: createColorObjectFormatter(supportsAlpha, args.params.colorType),
        parser: createColorStringParser("int"),
        pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : "popup",
        supportsAlpha,
        value: args.value,
        viewProps: args.viewProps
      });
    }
  });
  var StringColorInputPlugin = createPlugin({
    id: "input-color-string",
    type: "input",
    accept: (value, params) => {
      if (typeof value !== "string") {
        return null;
      }
      if (params.view === "text") {
        return null;
      }
      const format = detectStringColorFormat(value, extractColorType(params));
      if (!format) {
        return null;
      }
      const stringifier = findColorStringifier(format);
      if (!stringifier) {
        return null;
      }
      const result = parseColorInputParams(params);
      return result ? {
        initialValue: value,
        params: Object.assign(Object.assign({}, result), { format, stringifier })
      } : null;
    },
    binding: {
      reader: () => readIntColorString,
      equals: equalsColor,
      writer: (args) => {
        const writer = createColorStringWriter(args.params.format);
        if (!writer) {
          throw TpError.notBindable();
        }
        return writer;
      }
    },
    controller: (args) => {
      var _a, _b;
      return new ColorController(args.document, {
        colorType: args.params.format.type,
        expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
        formatter: args.params.stringifier,
        parser: createColorStringParser("int"),
        pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : "popup",
        supportsAlpha: args.params.format.alpha,
        value: args.value,
        viewProps: args.viewProps
      });
    }
  });
  var PointNdConstraint = class {
    constructor(config) {
      this.components = config.components;
      this.asm_ = config.assembly;
    }
    constrain(value) {
      const comps = this.asm_.toComponents(value).map((comp, index) => {
        var _a, _b;
        return (_b = (_a = this.components[index]) === null || _a === void 0 ? void 0 : _a.constrain(comp)) !== null && _b !== void 0 ? _b : comp;
      });
      return this.asm_.fromComponents(comps);
    }
  };
  var cn$6 = ClassName("pndtxt");
  var PointNdTextView = class {
    constructor(doc, config) {
      this.textViews = config.textViews;
      this.element = doc.createElement("div");
      this.element.classList.add(cn$6());
      this.textViews.forEach((v2) => {
        const axisElem = doc.createElement("div");
        axisElem.classList.add(cn$6("a"));
        axisElem.appendChild(v2.element);
        this.element.appendChild(axisElem);
      });
    }
  };
  function createAxisController(doc, config, index) {
    return new NumberTextController(doc, {
      arrayPosition: index === 0 ? "fst" : index === config.axes.length - 1 ? "lst" : "mid",
      parser: config.parser,
      props: config.axes[index].textProps,
      value: createValue(0, {
        constraint: config.axes[index].constraint
      }),
      viewProps: config.viewProps
    });
  }
  var PointNdTextController = class {
    constructor(doc, config) {
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.acs_ = config.axes.map((_2, index) => createAxisController(doc, config, index));
      this.acs_.forEach((c2, index) => {
        connectValues({
          primary: this.value,
          secondary: c2.value,
          forward: (p2) => config.assembly.toComponents(p2)[index],
          backward: (p2, s) => {
            const comps = config.assembly.toComponents(p2);
            comps[index] = s;
            return config.assembly.fromComponents(comps);
          }
        });
      });
      this.view = new PointNdTextView(doc, {
        textViews: this.acs_.map((ac) => ac.view)
      });
    }
    get textControllers() {
      return this.acs_;
    }
  };
  var SliderInputBindingApi = class extends BindingApi {
    get max() {
      return this.controller.valueController.sliderController.props.get("max");
    }
    set max(max) {
      this.controller.valueController.sliderController.props.set("max", max);
    }
    get min() {
      return this.controller.valueController.sliderController.props.get("min");
    }
    set min(max) {
      this.controller.valueController.sliderController.props.set("min", max);
    }
  };
  function createConstraint$4(params, initialValue) {
    const constraints = [];
    const sc = createStepConstraint(params, initialValue);
    if (sc) {
      constraints.push(sc);
    }
    const rc = createRangeConstraint(params);
    if (rc) {
      constraints.push(rc);
    }
    const lc = createListConstraint(params.options);
    if (lc) {
      constraints.push(lc);
    }
    return new CompositeConstraint(constraints);
  }
  var NumberInputPlugin = createPlugin({
    id: "input-number",
    type: "input",
    accept: (value, params) => {
      if (typeof value !== "number") {
        return null;
      }
      const result = parseRecord(params, (p2) => Object.assign(Object.assign({}, createNumberTextInputParamsParser(p2)), { options: p2.optional.custom(parseListOptions), readonly: p2.optional.constant(false) }));
      return result ? {
        initialValue: value,
        params: result
      } : null;
    },
    binding: {
      reader: (_args) => numberFromUnknown,
      constraint: (args) => createConstraint$4(args.params, args.initialValue),
      writer: (_args) => writePrimitive
    },
    controller: (args) => {
      const value = args.value;
      const c2 = args.constraint;
      const lc = c2 && findConstraint(c2, ListConstraint);
      if (lc) {
        return new ListController(args.document, {
          props: new ValueMap({
            options: lc.values.value("options")
          }),
          value,
          viewProps: args.viewProps
        });
      }
      const textPropsObj = createNumberTextPropsObject(args.params, value.rawValue);
      const drc = c2 && findConstraint(c2, DefiniteRangeConstraint);
      if (drc) {
        return new SliderTextController(args.document, Object.assign(Object.assign({}, createSliderTextProps(Object.assign(Object.assign({}, textPropsObj), { keyScale: createValue(textPropsObj.keyScale), max: drc.values.value("max"), min: drc.values.value("min") }))), { parser: parseNumber, value, viewProps: args.viewProps }));
      }
      return new NumberTextController(args.document, {
        parser: parseNumber,
        props: ValueMap.fromObject(textPropsObj),
        value,
        viewProps: args.viewProps
      });
    },
    api(args) {
      if (typeof args.controller.value.rawValue !== "number") {
        return null;
      }
      if (args.controller.valueController instanceof SliderTextController) {
        return new SliderInputBindingApi(args.controller);
      }
      if (args.controller.valueController instanceof ListController) {
        return new ListInputBindingApi(args.controller);
      }
      return null;
    }
  });
  var Point2d = class {
    constructor(x2 = 0, y2 = 0) {
      this.x = x2;
      this.y = y2;
    }
    getComponents() {
      return [this.x, this.y];
    }
    static isObject(obj) {
      if (isEmpty(obj)) {
        return false;
      }
      const x2 = obj.x;
      const y2 = obj.y;
      if (typeof x2 !== "number" || typeof y2 !== "number") {
        return false;
      }
      return true;
    }
    static equals(v1, v2) {
      return v1.x === v2.x && v1.y === v2.y;
    }
    toObject() {
      return {
        x: this.x,
        y: this.y
      };
    }
  };
  var Point2dAssembly = {
    toComponents: (p2) => p2.getComponents(),
    fromComponents: (comps) => new Point2d(...comps)
  };
  var cn$5 = ClassName("p2d");
  var Point2dView = class {
    constructor(doc, config) {
      this.element = doc.createElement("div");
      this.element.classList.add(cn$5());
      config.viewProps.bindClassModifiers(this.element);
      bindValue(config.expanded, valueToClassName(this.element, cn$5(void 0, "expanded")));
      const headElem = doc.createElement("div");
      headElem.classList.add(cn$5("h"));
      this.element.appendChild(headElem);
      const buttonElem = doc.createElement("button");
      buttonElem.classList.add(cn$5("b"));
      buttonElem.appendChild(createSvgIconElement(doc, "p2dpad"));
      config.viewProps.bindDisabled(buttonElem);
      headElem.appendChild(buttonElem);
      this.buttonElement = buttonElem;
      const textElem = doc.createElement("div");
      textElem.classList.add(cn$5("t"));
      headElem.appendChild(textElem);
      this.textElement = textElem;
      if (config.pickerLayout === "inline") {
        const pickerElem = doc.createElement("div");
        pickerElem.classList.add(cn$5("p"));
        this.element.appendChild(pickerElem);
        this.pickerElement = pickerElem;
      } else {
        this.pickerElement = null;
      }
    }
  };
  var cn$4 = ClassName("p2dp");
  var Point2dPickerView = class {
    constructor(doc, config) {
      this.onFoldableChange_ = this.onFoldableChange_.bind(this);
      this.onPropsChange_ = this.onPropsChange_.bind(this);
      this.onValueChange_ = this.onValueChange_.bind(this);
      this.props_ = config.props;
      this.props_.emitter.on("change", this.onPropsChange_);
      this.element = doc.createElement("div");
      this.element.classList.add(cn$4());
      if (config.layout === "popup") {
        this.element.classList.add(cn$4(void 0, "p"));
      }
      config.viewProps.bindClassModifiers(this.element);
      const padElem = doc.createElement("div");
      padElem.classList.add(cn$4("p"));
      config.viewProps.bindTabIndex(padElem);
      this.element.appendChild(padElem);
      this.padElement = padElem;
      const svgElem = doc.createElementNS(SVG_NS, "svg");
      svgElem.classList.add(cn$4("g"));
      this.padElement.appendChild(svgElem);
      this.svgElem_ = svgElem;
      const xAxisElem = doc.createElementNS(SVG_NS, "line");
      xAxisElem.classList.add(cn$4("ax"));
      xAxisElem.setAttributeNS(null, "x1", "0");
      xAxisElem.setAttributeNS(null, "y1", "50%");
      xAxisElem.setAttributeNS(null, "x2", "100%");
      xAxisElem.setAttributeNS(null, "y2", "50%");
      this.svgElem_.appendChild(xAxisElem);
      const yAxisElem = doc.createElementNS(SVG_NS, "line");
      yAxisElem.classList.add(cn$4("ax"));
      yAxisElem.setAttributeNS(null, "x1", "50%");
      yAxisElem.setAttributeNS(null, "y1", "0");
      yAxisElem.setAttributeNS(null, "x2", "50%");
      yAxisElem.setAttributeNS(null, "y2", "100%");
      this.svgElem_.appendChild(yAxisElem);
      const lineElem = doc.createElementNS(SVG_NS, "line");
      lineElem.classList.add(cn$4("l"));
      lineElem.setAttributeNS(null, "x1", "50%");
      lineElem.setAttributeNS(null, "y1", "50%");
      this.svgElem_.appendChild(lineElem);
      this.lineElem_ = lineElem;
      const markerElem = doc.createElement("div");
      markerElem.classList.add(cn$4("m"));
      this.padElement.appendChild(markerElem);
      this.markerElem_ = markerElem;
      config.value.emitter.on("change", this.onValueChange_);
      this.value = config.value;
      this.update_();
    }
    get allFocusableElements() {
      return [this.padElement];
    }
    update_() {
      const [x2, y2] = this.value.rawValue.getComponents();
      const max = this.props_.get("max");
      const px = mapRange(x2, -max, +max, 0, 100);
      const py = mapRange(y2, -max, +max, 0, 100);
      const ipy = this.props_.get("invertsY") ? 100 - py : py;
      this.lineElem_.setAttributeNS(null, "x2", `${px}%`);
      this.lineElem_.setAttributeNS(null, "y2", `${ipy}%`);
      this.markerElem_.style.left = `${px}%`;
      this.markerElem_.style.top = `${ipy}%`;
    }
    onValueChange_() {
      this.update_();
    }
    onPropsChange_() {
      this.update_();
    }
    onFoldableChange_() {
      this.update_();
    }
  };
  function computeOffset(ev, keyScales, invertsY) {
    return [
      getStepForKey(keyScales[0], getHorizontalStepKeys(ev)),
      getStepForKey(keyScales[1], getVerticalStepKeys(ev)) * (invertsY ? 1 : -1)
    ];
  }
  var Point2dPickerController = class {
    constructor(doc, config) {
      this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
      this.onPadKeyUp_ = this.onPadKeyUp_.bind(this);
      this.onPointerDown_ = this.onPointerDown_.bind(this);
      this.onPointerMove_ = this.onPointerMove_.bind(this);
      this.onPointerUp_ = this.onPointerUp_.bind(this);
      this.props = config.props;
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.view = new Point2dPickerView(doc, {
        layout: config.layout,
        props: this.props,
        value: this.value,
        viewProps: this.viewProps
      });
      this.ptHandler_ = new PointerHandler(this.view.padElement);
      this.ptHandler_.emitter.on("down", this.onPointerDown_);
      this.ptHandler_.emitter.on("move", this.onPointerMove_);
      this.ptHandler_.emitter.on("up", this.onPointerUp_);
      this.view.padElement.addEventListener("keydown", this.onPadKeyDown_);
      this.view.padElement.addEventListener("keyup", this.onPadKeyUp_);
    }
    handlePointerEvent_(d2, opts) {
      if (!d2.point) {
        return;
      }
      const max = this.props.get("max");
      const px = mapRange(d2.point.x, 0, d2.bounds.width, -max, +max);
      const py = mapRange(this.props.get("invertsY") ? d2.bounds.height - d2.point.y : d2.point.y, 0, d2.bounds.height, -max, +max);
      this.value.setRawValue(new Point2d(px, py), opts);
    }
    onPointerDown_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: false,
        last: false
      });
    }
    onPointerMove_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: false,
        last: false
      });
    }
    onPointerUp_(ev) {
      this.handlePointerEvent_(ev.data, {
        forceEmit: true,
        last: true
      });
    }
    onPadKeyDown_(ev) {
      if (isArrowKey(ev.key)) {
        ev.preventDefault();
      }
      const [dx, dy] = computeOffset(ev, [this.props.get("xKeyScale"), this.props.get("yKeyScale")], this.props.get("invertsY"));
      if (dx === 0 && dy === 0) {
        return;
      }
      this.value.setRawValue(new Point2d(this.value.rawValue.x + dx, this.value.rawValue.y + dy), {
        forceEmit: false,
        last: false
      });
    }
    onPadKeyUp_(ev) {
      const [dx, dy] = computeOffset(ev, [this.props.get("xKeyScale"), this.props.get("yKeyScale")], this.props.get("invertsY"));
      if (dx === 0 && dy === 0) {
        return;
      }
      this.value.setRawValue(this.value.rawValue, {
        forceEmit: true,
        last: true
      });
    }
  };
  var Point2dController = class {
    constructor(doc, config) {
      var _a, _b;
      this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
      this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
      this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
      this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.foldable_ = Foldable.create(config.expanded);
      this.popC_ = config.pickerLayout === "popup" ? new PopupController(doc, {
        viewProps: this.viewProps
      }) : null;
      const padC = new Point2dPickerController(doc, {
        layout: config.pickerLayout,
        props: new ValueMap({
          invertsY: createValue(config.invertsY),
          max: createValue(config.max),
          xKeyScale: config.axes[0].textProps.value("keyScale"),
          yKeyScale: config.axes[1].textProps.value("keyScale")
        }),
        value: this.value,
        viewProps: this.viewProps
      });
      padC.view.allFocusableElements.forEach((elem) => {
        elem.addEventListener("blur", this.onPopupChildBlur_);
        elem.addEventListener("keydown", this.onPopupChildKeydown_);
      });
      this.pickerC_ = padC;
      this.textC_ = new PointNdTextController(doc, {
        assembly: Point2dAssembly,
        axes: config.axes,
        parser: config.parser,
        value: this.value,
        viewProps: this.viewProps
      });
      this.view = new Point2dView(doc, {
        expanded: this.foldable_.value("expanded"),
        pickerLayout: config.pickerLayout,
        viewProps: this.viewProps
      });
      this.view.textElement.appendChild(this.textC_.view.element);
      (_a = this.view.buttonElement) === null || _a === void 0 ? void 0 : _a.addEventListener("blur", this.onPadButtonBlur_);
      (_b = this.view.buttonElement) === null || _b === void 0 ? void 0 : _b.addEventListener("click", this.onPadButtonClick_);
      if (this.popC_) {
        this.view.element.appendChild(this.popC_.view.element);
        this.popC_.view.element.appendChild(this.pickerC_.view.element);
        connectValues({
          primary: this.foldable_.value("expanded"),
          secondary: this.popC_.shows,
          forward: (p2) => p2,
          backward: (_2, s) => s
        });
      } else if (this.view.pickerElement) {
        this.view.pickerElement.appendChild(this.pickerC_.view.element);
        bindFoldable(this.foldable_, this.view.pickerElement);
      }
    }
    get textController() {
      return this.textC_;
    }
    onPadButtonBlur_(e) {
      if (!this.popC_) {
        return;
      }
      const elem = this.view.element;
      const nextTarget = forceCast(e.relatedTarget);
      if (!nextTarget || !elem.contains(nextTarget)) {
        this.popC_.shows.rawValue = false;
      }
    }
    onPadButtonClick_() {
      this.foldable_.set("expanded", !this.foldable_.get("expanded"));
      if (this.foldable_.get("expanded")) {
        this.pickerC_.view.allFocusableElements[0].focus();
      }
    }
    onPopupChildBlur_(ev) {
      if (!this.popC_) {
        return;
      }
      const elem = this.popC_.view.element;
      const nextTarget = findNextTarget(ev);
      if (nextTarget && elem.contains(nextTarget)) {
        return;
      }
      if (nextTarget && nextTarget === this.view.buttonElement && !supportsTouch(elem.ownerDocument)) {
        return;
      }
      this.popC_.shows.rawValue = false;
    }
    onPopupChildKeydown_(ev) {
      if (this.popC_) {
        if (ev.key === "Escape") {
          this.popC_.shows.rawValue = false;
        }
      } else if (this.view.pickerElement) {
        if (ev.key === "Escape") {
          this.view.buttonElement.focus();
        }
      }
    }
  };
  function point2dFromUnknown(value) {
    return Point2d.isObject(value) ? new Point2d(value.x, value.y) : new Point2d();
  }
  function writePoint2d(target2, value) {
    target2.writeProperty("x", value.x);
    target2.writeProperty("y", value.y);
  }
  function createConstraint$3(params, initialValue) {
    return new PointNdConstraint({
      assembly: Point2dAssembly,
      components: [
        createDimensionConstraint(Object.assign(Object.assign({}, params), params.x), initialValue.x),
        createDimensionConstraint(Object.assign(Object.assign({}, params), params.y), initialValue.y)
      ]
    });
  }
  function getSuitableMaxDimensionValue(params, rawValue) {
    var _a, _b;
    if (!isEmpty(params.min) || !isEmpty(params.max)) {
      return Math.max(Math.abs((_a = params.min) !== null && _a !== void 0 ? _a : 0), Math.abs((_b = params.max) !== null && _b !== void 0 ? _b : 0));
    }
    const step = getSuitableKeyScale(params);
    return Math.max(Math.abs(step) * 10, Math.abs(rawValue) * 10);
  }
  function getSuitableMax(params, initialValue) {
    var _a, _b;
    const xr = getSuitableMaxDimensionValue(deepMerge(params, (_a = params.x) !== null && _a !== void 0 ? _a : {}), initialValue.x);
    const yr = getSuitableMaxDimensionValue(deepMerge(params, (_b = params.y) !== null && _b !== void 0 ? _b : {}), initialValue.y);
    return Math.max(xr, yr);
  }
  function shouldInvertY(params) {
    if (!("y" in params)) {
      return false;
    }
    const yParams = params.y;
    if (!yParams) {
      return false;
    }
    return "inverted" in yParams ? !!yParams.inverted : false;
  }
  var Point2dInputPlugin = createPlugin({
    id: "input-point2d",
    type: "input",
    accept: (value, params) => {
      if (!Point2d.isObject(value)) {
        return null;
      }
      const result = parseRecord(params, (p2) => Object.assign(Object.assign({}, createPointDimensionParser(p2)), { expanded: p2.optional.boolean, picker: p2.optional.custom(parsePickerLayout), readonly: p2.optional.constant(false), x: p2.optional.custom(parsePointDimensionParams), y: p2.optional.object(Object.assign(Object.assign({}, createPointDimensionParser(p2)), { inverted: p2.optional.boolean })) }));
      return result ? {
        initialValue: value,
        params: result
      } : null;
    },
    binding: {
      reader: () => point2dFromUnknown,
      constraint: (args) => createConstraint$3(args.params, args.initialValue),
      equals: Point2d.equals,
      writer: () => writePoint2d
    },
    controller: (args) => {
      var _a, _b;
      const doc = args.document;
      const value = args.value;
      const c2 = args.constraint;
      const dParams = [args.params.x, args.params.y];
      return new Point2dController(doc, {
        axes: value.rawValue.getComponents().map((comp, i) => {
          var _a2;
          return createPointAxis({
            constraint: c2.components[i],
            initialValue: comp,
            params: deepMerge(args.params, (_a2 = dParams[i]) !== null && _a2 !== void 0 ? _a2 : {})
          });
        }),
        expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
        invertsY: shouldInvertY(args.params),
        max: getSuitableMax(args.params, value.rawValue),
        parser: parseNumber,
        pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : "popup",
        value,
        viewProps: args.viewProps
      });
    }
  });
  var Point3d = class {
    constructor(x2 = 0, y2 = 0, z2 = 0) {
      this.x = x2;
      this.y = y2;
      this.z = z2;
    }
    getComponents() {
      return [this.x, this.y, this.z];
    }
    static isObject(obj) {
      if (isEmpty(obj)) {
        return false;
      }
      const x2 = obj.x;
      const y2 = obj.y;
      const z2 = obj.z;
      if (typeof x2 !== "number" || typeof y2 !== "number" || typeof z2 !== "number") {
        return false;
      }
      return true;
    }
    static equals(v1, v2) {
      return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
    }
    toObject() {
      return {
        x: this.x,
        y: this.y,
        z: this.z
      };
    }
  };
  var Point3dAssembly = {
    toComponents: (p2) => p2.getComponents(),
    fromComponents: (comps) => new Point3d(...comps)
  };
  function point3dFromUnknown(value) {
    return Point3d.isObject(value) ? new Point3d(value.x, value.y, value.z) : new Point3d();
  }
  function writePoint3d(target2, value) {
    target2.writeProperty("x", value.x);
    target2.writeProperty("y", value.y);
    target2.writeProperty("z", value.z);
  }
  function createConstraint$2(params, initialValue) {
    return new PointNdConstraint({
      assembly: Point3dAssembly,
      components: [
        createDimensionConstraint(Object.assign(Object.assign({}, params), params.x), initialValue.x),
        createDimensionConstraint(Object.assign(Object.assign({}, params), params.y), initialValue.y),
        createDimensionConstraint(Object.assign(Object.assign({}, params), params.z), initialValue.z)
      ]
    });
  }
  var Point3dInputPlugin = createPlugin({
    id: "input-point3d",
    type: "input",
    accept: (value, params) => {
      if (!Point3d.isObject(value)) {
        return null;
      }
      const result = parseRecord(params, (p2) => Object.assign(Object.assign({}, createPointDimensionParser(p2)), { readonly: p2.optional.constant(false), x: p2.optional.custom(parsePointDimensionParams), y: p2.optional.custom(parsePointDimensionParams), z: p2.optional.custom(parsePointDimensionParams) }));
      return result ? {
        initialValue: value,
        params: result
      } : null;
    },
    binding: {
      reader: (_args) => point3dFromUnknown,
      constraint: (args) => createConstraint$2(args.params, args.initialValue),
      equals: Point3d.equals,
      writer: (_args) => writePoint3d
    },
    controller: (args) => {
      const value = args.value;
      const c2 = args.constraint;
      const dParams = [args.params.x, args.params.y, args.params.z];
      return new PointNdTextController(args.document, {
        assembly: Point3dAssembly,
        axes: value.rawValue.getComponents().map((comp, i) => {
          var _a;
          return createPointAxis({
            constraint: c2.components[i],
            initialValue: comp,
            params: deepMerge(args.params, (_a = dParams[i]) !== null && _a !== void 0 ? _a : {})
          });
        }),
        parser: parseNumber,
        value,
        viewProps: args.viewProps
      });
    }
  });
  var Point4d = class {
    constructor(x2 = 0, y2 = 0, z2 = 0, w2 = 0) {
      this.x = x2;
      this.y = y2;
      this.z = z2;
      this.w = w2;
    }
    getComponents() {
      return [this.x, this.y, this.z, this.w];
    }
    static isObject(obj) {
      if (isEmpty(obj)) {
        return false;
      }
      const x2 = obj.x;
      const y2 = obj.y;
      const z2 = obj.z;
      const w2 = obj.w;
      if (typeof x2 !== "number" || typeof y2 !== "number" || typeof z2 !== "number" || typeof w2 !== "number") {
        return false;
      }
      return true;
    }
    static equals(v1, v2) {
      return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z && v1.w === v2.w;
    }
    toObject() {
      return {
        x: this.x,
        y: this.y,
        z: this.z,
        w: this.w
      };
    }
  };
  var Point4dAssembly = {
    toComponents: (p2) => p2.getComponents(),
    fromComponents: (comps) => new Point4d(...comps)
  };
  function point4dFromUnknown(value) {
    return Point4d.isObject(value) ? new Point4d(value.x, value.y, value.z, value.w) : new Point4d();
  }
  function writePoint4d(target2, value) {
    target2.writeProperty("x", value.x);
    target2.writeProperty("y", value.y);
    target2.writeProperty("z", value.z);
    target2.writeProperty("w", value.w);
  }
  function createConstraint$1(params, initialValue) {
    return new PointNdConstraint({
      assembly: Point4dAssembly,
      components: [
        createDimensionConstraint(Object.assign(Object.assign({}, params), params.x), initialValue.x),
        createDimensionConstraint(Object.assign(Object.assign({}, params), params.y), initialValue.y),
        createDimensionConstraint(Object.assign(Object.assign({}, params), params.z), initialValue.z),
        createDimensionConstraint(Object.assign(Object.assign({}, params), params.w), initialValue.w)
      ]
    });
  }
  var Point4dInputPlugin = createPlugin({
    id: "input-point4d",
    type: "input",
    accept: (value, params) => {
      if (!Point4d.isObject(value)) {
        return null;
      }
      const result = parseRecord(params, (p2) => Object.assign(Object.assign({}, createPointDimensionParser(p2)), { readonly: p2.optional.constant(false), w: p2.optional.custom(parsePointDimensionParams), x: p2.optional.custom(parsePointDimensionParams), y: p2.optional.custom(parsePointDimensionParams), z: p2.optional.custom(parsePointDimensionParams) }));
      return result ? {
        initialValue: value,
        params: result
      } : null;
    },
    binding: {
      reader: (_args) => point4dFromUnknown,
      constraint: (args) => createConstraint$1(args.params, args.initialValue),
      equals: Point4d.equals,
      writer: (_args) => writePoint4d
    },
    controller: (args) => {
      const value = args.value;
      const c2 = args.constraint;
      const dParams = [
        args.params.x,
        args.params.y,
        args.params.z,
        args.params.w
      ];
      return new PointNdTextController(args.document, {
        assembly: Point4dAssembly,
        axes: value.rawValue.getComponents().map((comp, i) => {
          var _a;
          return createPointAxis({
            constraint: c2.components[i],
            initialValue: comp,
            params: deepMerge(args.params, (_a = dParams[i]) !== null && _a !== void 0 ? _a : {})
          });
        }),
        parser: parseNumber,
        value,
        viewProps: args.viewProps
      });
    }
  });
  function createConstraint(params) {
    const constraints = [];
    const lc = createListConstraint(params.options);
    if (lc) {
      constraints.push(lc);
    }
    return new CompositeConstraint(constraints);
  }
  var StringInputPlugin = createPlugin({
    id: "input-string",
    type: "input",
    accept: (value, params) => {
      if (typeof value !== "string") {
        return null;
      }
      const result = parseRecord(params, (p2) => ({
        readonly: p2.optional.constant(false),
        options: p2.optional.custom(parseListOptions)
      }));
      return result ? {
        initialValue: value,
        params: result
      } : null;
    },
    binding: {
      reader: (_args) => stringFromUnknown,
      constraint: (args) => createConstraint(args.params),
      writer: (_args) => writePrimitive
    },
    controller: (args) => {
      const doc = args.document;
      const value = args.value;
      const c2 = args.constraint;
      const lc = c2 && findConstraint(c2, ListConstraint);
      if (lc) {
        return new ListController(doc, {
          props: new ValueMap({
            options: lc.values.value("options")
          }),
          value,
          viewProps: args.viewProps
        });
      }
      return new TextController(doc, {
        parser: (v2) => v2,
        props: ValueMap.fromObject({
          formatter: formatString
        }),
        value,
        viewProps: args.viewProps
      });
    },
    api(args) {
      if (typeof args.controller.value.rawValue !== "string") {
        return null;
      }
      if (args.controller.valueController instanceof ListController) {
        return new ListInputBindingApi(args.controller);
      }
      return null;
    }
  });
  var Constants = {
    monitor: {
      defaultInterval: 200,
      defaultRows: 3
    }
  };
  var cn$3 = ClassName("mll");
  var MultiLogView = class {
    constructor(doc, config) {
      this.onValueUpdate_ = this.onValueUpdate_.bind(this);
      this.formatter_ = config.formatter;
      this.element = doc.createElement("div");
      this.element.classList.add(cn$3());
      config.viewProps.bindClassModifiers(this.element);
      const textareaElem = doc.createElement("textarea");
      textareaElem.classList.add(cn$3("i"));
      textareaElem.style.height = `calc(var(${getCssVar("containerUnitSize")}) * ${config.rows})`;
      textareaElem.readOnly = true;
      config.viewProps.bindDisabled(textareaElem);
      this.element.appendChild(textareaElem);
      this.textareaElem_ = textareaElem;
      config.value.emitter.on("change", this.onValueUpdate_);
      this.value = config.value;
      this.update_();
    }
    update_() {
      const elem = this.textareaElem_;
      const shouldScroll = elem.scrollTop === elem.scrollHeight - elem.clientHeight;
      const lines = [];
      this.value.rawValue.forEach((value) => {
        if (value !== void 0) {
          lines.push(this.formatter_(value));
        }
      });
      elem.textContent = lines.join("\n");
      if (shouldScroll) {
        elem.scrollTop = elem.scrollHeight;
      }
    }
    onValueUpdate_() {
      this.update_();
    }
  };
  var MultiLogController = class {
    constructor(doc, config) {
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.view = new MultiLogView(doc, {
        formatter: config.formatter,
        rows: config.rows,
        value: this.value,
        viewProps: this.viewProps
      });
    }
  };
  var cn$2 = ClassName("sgl");
  var SingleLogView = class {
    constructor(doc, config) {
      this.onValueUpdate_ = this.onValueUpdate_.bind(this);
      this.formatter_ = config.formatter;
      this.element = doc.createElement("div");
      this.element.classList.add(cn$2());
      config.viewProps.bindClassModifiers(this.element);
      const inputElem = doc.createElement("input");
      inputElem.classList.add(cn$2("i"));
      inputElem.readOnly = true;
      inputElem.type = "text";
      config.viewProps.bindDisabled(inputElem);
      this.element.appendChild(inputElem);
      this.inputElement = inputElem;
      config.value.emitter.on("change", this.onValueUpdate_);
      this.value = config.value;
      this.update_();
    }
    update_() {
      const values = this.value.rawValue;
      const lastValue = values[values.length - 1];
      this.inputElement.value = lastValue !== void 0 ? this.formatter_(lastValue) : "";
    }
    onValueUpdate_() {
      this.update_();
    }
  };
  var SingleLogController = class {
    constructor(doc, config) {
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.view = new SingleLogView(doc, {
        formatter: config.formatter,
        value: this.value,
        viewProps: this.viewProps
      });
    }
  };
  var BooleanMonitorPlugin = createPlugin({
    id: "monitor-bool",
    type: "monitor",
    accept: (value, params) => {
      if (typeof value !== "boolean") {
        return null;
      }
      const result = parseRecord(params, (p2) => ({
        readonly: p2.required.constant(true),
        rows: p2.optional.number
      }));
      return result ? {
        initialValue: value,
        params: result
      } : null;
    },
    binding: {
      reader: (_args) => boolFromUnknown
    },
    controller: (args) => {
      var _a;
      if (args.value.rawValue.length === 1) {
        return new SingleLogController(args.document, {
          formatter: BooleanFormatter,
          value: args.value,
          viewProps: args.viewProps
        });
      }
      return new MultiLogController(args.document, {
        formatter: BooleanFormatter,
        rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
        value: args.value,
        viewProps: args.viewProps
      });
    }
  });
  var GraphLogMonitorBindingApi = class extends BindingApi {
    get max() {
      return this.controller.valueController.props.get("max");
    }
    set max(max) {
      this.controller.valueController.props.set("max", max);
    }
    get min() {
      return this.controller.valueController.props.get("min");
    }
    set min(min) {
      this.controller.valueController.props.set("min", min);
    }
  };
  var cn$1 = ClassName("grl");
  var GraphLogView = class {
    constructor(doc, config) {
      this.onCursorChange_ = this.onCursorChange_.bind(this);
      this.onValueUpdate_ = this.onValueUpdate_.bind(this);
      this.element = doc.createElement("div");
      this.element.classList.add(cn$1());
      config.viewProps.bindClassModifiers(this.element);
      this.formatter_ = config.formatter;
      this.props_ = config.props;
      this.cursor_ = config.cursor;
      this.cursor_.emitter.on("change", this.onCursorChange_);
      const svgElem = doc.createElementNS(SVG_NS, "svg");
      svgElem.classList.add(cn$1("g"));
      svgElem.style.height = `calc(var(${getCssVar("containerUnitSize")}) * ${config.rows})`;
      this.element.appendChild(svgElem);
      this.svgElem_ = svgElem;
      const lineElem = doc.createElementNS(SVG_NS, "polyline");
      this.svgElem_.appendChild(lineElem);
      this.lineElem_ = lineElem;
      const tooltipElem = doc.createElement("div");
      tooltipElem.classList.add(cn$1("t"), ClassName("tt")());
      this.element.appendChild(tooltipElem);
      this.tooltipElem_ = tooltipElem;
      config.value.emitter.on("change", this.onValueUpdate_);
      this.value = config.value;
      this.update_();
    }
    get graphElement() {
      return this.svgElem_;
    }
    update_() {
      const bounds = this.svgElem_.getBoundingClientRect();
      const maxIndex = this.value.rawValue.length - 1;
      const min = this.props_.get("min");
      const max = this.props_.get("max");
      const points = [];
      this.value.rawValue.forEach((v2, index) => {
        if (v2 === void 0) {
          return;
        }
        const x2 = mapRange(index, 0, maxIndex, 0, bounds.width);
        const y2 = mapRange(v2, min, max, bounds.height, 0);
        points.push([x2, y2].join(","));
      });
      this.lineElem_.setAttributeNS(null, "points", points.join(" "));
      const tooltipElem = this.tooltipElem_;
      const value = this.value.rawValue[this.cursor_.rawValue];
      if (value === void 0) {
        tooltipElem.classList.remove(cn$1("t", "a"));
        return;
      }
      const tx = mapRange(this.cursor_.rawValue, 0, maxIndex, 0, bounds.width);
      const ty = mapRange(value, min, max, bounds.height, 0);
      tooltipElem.style.left = `${tx}px`;
      tooltipElem.style.top = `${ty}px`;
      tooltipElem.textContent = `${this.formatter_(value)}`;
      if (!tooltipElem.classList.contains(cn$1("t", "a"))) {
        tooltipElem.classList.add(cn$1("t", "a"), cn$1("t", "in"));
        forceReflow(tooltipElem);
        tooltipElem.classList.remove(cn$1("t", "in"));
      }
    }
    onValueUpdate_() {
      this.update_();
    }
    onCursorChange_() {
      this.update_();
    }
  };
  var GraphLogController = class {
    constructor(doc, config) {
      this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);
      this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
      this.onGraphPointerDown_ = this.onGraphPointerDown_.bind(this);
      this.onGraphPointerMove_ = this.onGraphPointerMove_.bind(this);
      this.onGraphPointerUp_ = this.onGraphPointerUp_.bind(this);
      this.props = config.props;
      this.value = config.value;
      this.viewProps = config.viewProps;
      this.cursor_ = createValue(-1);
      this.view = new GraphLogView(doc, {
        cursor: this.cursor_,
        formatter: config.formatter,
        rows: config.rows,
        props: this.props,
        value: this.value,
        viewProps: this.viewProps
      });
      if (!supportsTouch(doc)) {
        this.view.element.addEventListener("mousemove", this.onGraphMouseMove_);
        this.view.element.addEventListener("mouseleave", this.onGraphMouseLeave_);
      } else {
        const ph = new PointerHandler(this.view.element);
        ph.emitter.on("down", this.onGraphPointerDown_);
        ph.emitter.on("move", this.onGraphPointerMove_);
        ph.emitter.on("up", this.onGraphPointerUp_);
      }
    }
    importProps(state) {
      return importBladeState(state, null, (p2) => ({
        max: p2.required.number,
        min: p2.required.number
      }), (result) => {
        this.props.set("max", result.max);
        this.props.set("min", result.min);
        return true;
      });
    }
    exportProps() {
      return exportBladeState(null, {
        max: this.props.get("max"),
        min: this.props.get("min")
      });
    }
    onGraphMouseLeave_() {
      this.cursor_.rawValue = -1;
    }
    onGraphMouseMove_(ev) {
      const bounds = this.view.element.getBoundingClientRect();
      this.cursor_.rawValue = Math.floor(mapRange(ev.offsetX, 0, bounds.width, 0, this.value.rawValue.length));
    }
    onGraphPointerDown_(ev) {
      this.onGraphPointerMove_(ev);
    }
    onGraphPointerMove_(ev) {
      if (!ev.data.point) {
        this.cursor_.rawValue = -1;
        return;
      }
      this.cursor_.rawValue = Math.floor(mapRange(ev.data.point.x, 0, ev.data.bounds.width, 0, this.value.rawValue.length));
    }
    onGraphPointerUp_() {
      this.cursor_.rawValue = -1;
    }
  };
  function createFormatter(params) {
    return !isEmpty(params.format) ? params.format : createNumberFormatter(2);
  }
  function createTextMonitor(args) {
    var _a;
    if (args.value.rawValue.length === 1) {
      return new SingleLogController(args.document, {
        formatter: createFormatter(args.params),
        value: args.value,
        viewProps: args.viewProps
      });
    }
    return new MultiLogController(args.document, {
      formatter: createFormatter(args.params),
      rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
      value: args.value,
      viewProps: args.viewProps
    });
  }
  function createGraphMonitor(args) {
    var _a, _b, _c;
    return new GraphLogController(args.document, {
      formatter: createFormatter(args.params),
      rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
      props: ValueMap.fromObject({
        max: (_b = args.params.max) !== null && _b !== void 0 ? _b : 100,
        min: (_c = args.params.min) !== null && _c !== void 0 ? _c : 0
      }),
      value: args.value,
      viewProps: args.viewProps
    });
  }
  function shouldShowGraph(params) {
    return params.view === "graph";
  }
  var NumberMonitorPlugin = createPlugin({
    id: "monitor-number",
    type: "monitor",
    accept: (value, params) => {
      if (typeof value !== "number") {
        return null;
      }
      const result = parseRecord(params, (p2) => ({
        format: p2.optional.function,
        max: p2.optional.number,
        min: p2.optional.number,
        readonly: p2.required.constant(true),
        rows: p2.optional.number,
        view: p2.optional.string
      }));
      return result ? {
        initialValue: value,
        params: result
      } : null;
    },
    binding: {
      defaultBufferSize: (params) => shouldShowGraph(params) ? 64 : 1,
      reader: (_args) => numberFromUnknown
    },
    controller: (args) => {
      if (shouldShowGraph(args.params)) {
        return createGraphMonitor(args);
      }
      return createTextMonitor(args);
    },
    api: (args) => {
      if (args.controller.valueController instanceof GraphLogController) {
        return new GraphLogMonitorBindingApi(args.controller);
      }
      return null;
    }
  });
  var StringMonitorPlugin = createPlugin({
    id: "monitor-string",
    type: "monitor",
    accept: (value, params) => {
      if (typeof value !== "string") {
        return null;
      }
      const result = parseRecord(params, (p2) => ({
        multiline: p2.optional.boolean,
        readonly: p2.required.constant(true),
        rows: p2.optional.number
      }));
      return result ? {
        initialValue: value,
        params: result
      } : null;
    },
    binding: {
      reader: (_args) => stringFromUnknown
    },
    controller: (args) => {
      var _a;
      const value = args.value;
      const multiline = value.rawValue.length > 1 || args.params.multiline;
      if (multiline) {
        return new MultiLogController(args.document, {
          formatter: formatString,
          rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
          value,
          viewProps: args.viewProps
        });
      }
      return new SingleLogController(args.document, {
        formatter: formatString,
        value,
        viewProps: args.viewProps
      });
    }
  });
  var BladeApiCache = class {
    constructor() {
      this.map_ = /* @__PURE__ */ new Map();
    }
    get(bc) {
      var _a;
      return (_a = this.map_.get(bc)) !== null && _a !== void 0 ? _a : null;
    }
    has(bc) {
      return this.map_.has(bc);
    }
    add(bc, api) {
      this.map_.set(bc, api);
      bc.viewProps.handleDispose(() => {
        this.map_.delete(bc);
      });
      return api;
    }
  };
  var sharedCache = new BladeApiCache();
  var ListBladeApi = class extends BladeApi {
    /**
     * @hidden
     */
    constructor(controller) {
      super(controller);
      this.emitter_ = new Emitter();
      this.controller.value.emitter.on("change", (ev) => {
        this.emitter_.emit("change", new TpChangeEvent(this, ev.rawValue));
      });
    }
    get label() {
      return this.controller.labelController.props.get("label");
    }
    set label(label) {
      this.controller.labelController.props.set("label", label);
    }
    get options() {
      return this.controller.valueController.props.get("options");
    }
    set options(options) {
      this.controller.valueController.props.set("options", options);
    }
    get value() {
      return this.controller.value.rawValue;
    }
    set value(value) {
      this.controller.value.rawValue = value;
    }
    on(eventName, handler) {
      const bh = handler.bind(this);
      this.emitter_.on(eventName, (ev) => {
        bh(ev);
      });
      return this;
    }
  };
  var TextBladeApi = class extends BladeApi {
    /**
     * @hidden
     */
    constructor(controller) {
      super(controller);
      this.emitter_ = new Emitter();
      this.controller.value.emitter.on("change", (ev) => {
        this.emitter_.emit("change", new TpChangeEvent(this, ev.rawValue));
      });
    }
    get label() {
      return this.controller.labelController.props.get("label");
    }
    set label(label) {
      this.controller.labelController.props.set("label", label);
    }
    get formatter() {
      return this.controller.valueController.props.get("formatter");
    }
    set formatter(formatter) {
      this.controller.valueController.props.set("formatter", formatter);
    }
    get value() {
      return this.controller.value.rawValue;
    }
    set value(value) {
      this.controller.value.rawValue = value;
    }
    on(eventName, handler) {
      const bh = handler.bind(this);
      this.emitter_.on(eventName, (ev) => {
        bh(ev);
      });
      return this;
    }
  };
  var ListBladePlugin = function() {
    return {
      id: "list",
      type: "blade",
      core: VERSION$1,
      accept(params) {
        const result = parseRecord(params, (p2) => ({
          options: p2.required.custom(parseListOptions),
          value: p2.required.raw,
          view: p2.required.constant("list"),
          label: p2.optional.string
        }));
        return result ? { params: result } : null;
      },
      controller(args) {
        const lc = new ListConstraint(normalizeListOptions(args.params.options));
        const value = createValue(args.params.value, {
          constraint: lc
        });
        const ic = new ListController(args.document, {
          props: new ValueMap({
            options: lc.values.value("options")
          }),
          value,
          viewProps: args.viewProps
        });
        return new LabeledValueBladeController(args.document, {
          blade: args.blade,
          props: ValueMap.fromObject({
            label: args.params.label
          }),
          value,
          valueController: ic
        });
      },
      api(args) {
        if (!(args.controller instanceof LabeledValueBladeController)) {
          return null;
        }
        if (!(args.controller.valueController instanceof ListController)) {
          return null;
        }
        return new ListBladeApi(args.controller);
      }
    };
  }();
  var cn = ClassName("spr");
  var TextBladePlugin = function() {
    return {
      id: "text",
      type: "blade",
      core: VERSION$1,
      accept(params) {
        const result = parseRecord(params, (p2) => ({
          parse: p2.required.function,
          value: p2.required.raw,
          view: p2.required.constant("text"),
          format: p2.optional.function,
          label: p2.optional.string
        }));
        return result ? { params: result } : null;
      },
      controller(args) {
        var _a;
        const v2 = createValue(args.params.value);
        const ic = new TextController(args.document, {
          parser: args.params.parse,
          props: ValueMap.fromObject({
            formatter: (_a = args.params.format) !== null && _a !== void 0 ? _a : (v3) => String(v3)
          }),
          value: v2,
          viewProps: args.viewProps
        });
        return new LabeledValueBladeController(args.document, {
          blade: args.blade,
          props: ValueMap.fromObject({
            label: args.params.label
          }),
          value: v2,
          valueController: ic
        });
      },
      api(args) {
        if (!(args.controller instanceof LabeledValueBladeController)) {
          return null;
        }
        if (!(args.controller.valueController instanceof TextController)) {
          return null;
        }
        return new TextBladeApi(args.controller);
      }
    };
  }();
  var VERSION = new Semver("4.0.1");

  // src/engine/diagnostics.ts
  Symbol.metadata ??= Symbol.for("Symbol.metadata");
  var unit = (unit2) => (target2, name) => {
    if (!target2[Symbol.metadata]) {
      Object.defineProperty(target2, Symbol.metadata, {
        value: {},
        enumerable: false
      });
    }
    target2[Symbol.metadata][name] = formatLabel(name) + ` (${unit2})`;
  };
  var Diagnostics = class {
  };
  // Rendering FPS (ideally totally handled by pixi)
  __publicField(Diagnostics, "FPS", 0);
  __publicField(Diagnostics, "logicTick", 0);
  // Whether or not artificial lag is being applied
  __publicField(Diagnostics, "artificialLag", false);
  // Which connection is the worst
  __publicField(Diagnostics, "worstRemoteConnection", "");
  __publicField(Diagnostics, "worstRemotePing", 0);
  __publicField(Diagnostics, "worstRemoteLatency", 0);
  __decorateClass([
    unit("ms")
  ], Diagnostics, "logicTick", 2);
  __decorateClass([
    unit("ms")
  ], Diagnostics, "worstRemotePing", 2);
  __decorateClass([
    unit("frames")
  ], Diagnostics, "worstRemoteLatency", 2);
  function formatLabel(camelCase) {
    camelCase = camelCase.replace(/([a-z])([A-Z])/g, "$1 $2");
    camelCase = camelCase.replace(/^./, (str) => str.toUpperCase());
    return camelCase;
  }

  // src/engine/resource.ts
  function ResourceUpdaterSystem(resource) {
    return class ResourceUpdater extends $t({}) {
      update() {
        this.world.get(resource)?.update();
      }
    };
  }
  function ResourceUpdaterPlugin(resource, addNew, ...args) {
    return async function(world) {
      if (addNew) {
        const res = new resource(world, ...args);
        world.add(res);
      }
      world.addSystem(ResourceUpdaterSystem(resource));
    };
  }

  // src/engine/multiplayer/network.ts
  var PeerId = Ye(St.string);
  var _NetworkConnection = class {
    constructor(world) {
      this.world = world;
      this.waitForServerConnection = this.connectToBrokageServer();
      this.waitForServerConnection.then(() => {
        this.logger.log("Connected to brokage server, id is", this.id);
        this.handleIncomingConnections();
        window.addEventListener("beforeunload", () => {
          this.close();
        });
      });
      this.onConnect = this.onConnect.bind(this);
      this.onClose = this.onClose.bind(this);
    }
    logger = new m("Network");
    static generateId() {
      return new Array(_NetworkConnection.idLength).fill(0).map((_2) => Math.floor(Math.random() * 2)).map((num) => String.fromCharCode("A".charCodeAt(0) + num)).join("");
    }
    peer;
    id;
    waitForServerConnection;
    //#region Server Connection
    tryFindId() {
      const id = _NetworkConnection.generateId();
      const peer = new $416260bce337df90$export$ecd1fc136c422448(_NetworkConnection.idPrefix + id);
      this.logger.log("Trying to connect with id", id);
      return new Promise((res, rej) => {
        peer.on("open", () => {
          res({ id, peer });
        });
        peer.on("error", async (error) => {
          if (error.type === "unavailable-id") {
            peer.disconnect();
            this.logger.log("Failed to connect with id", id);
            res(await this.tryFindId());
            return;
          }
          this.logger.error(error);
          rej(error);
        });
      });
    }
    async connectToBrokageServer() {
      const { id, peer } = await this.tryFindId();
      this.id = id;
      this.peer = peer;
    }
    //#endregion
    //#region Connections
    isConnected = false;
    dummyConnection = new DummyDataConnection();
    remoteConnection = this.dummyConnection;
    remoteId;
    resolvePromisesWaitingForConnection;
    waitForConnection = new Promise((res) => {
      this.resolvePromisesWaitingForConnection = res;
    });
    connectionStartTime = null;
    framesConnected = null;
    onConnect(openTime) {
      this.isConnected = true;
      this.connectionStartTime = openTime;
      this.remoteId = this.remoteConnection.peer.replace(
        _NetworkConnection.idPrefix,
        ""
      );
      this.framesConnected = 0;
      this.remoteConnection.on("close", this.onClose);
      this.logger.log("Connection opened to", this.remoteId);
      this.resolvePromisesWaitingForConnection();
    }
    onClose() {
      this.remoteConnection = this.dummyConnection.fromDataConnection(
        this.remoteConnection
      );
      this.isConnected = false;
      this.framesConnected = null;
      this.waitForConnection = new Promise((res) => {
        this.resolvePromisesWaitingForConnection = res;
      });
      this.logger.log("Closed connection to", this.remoteId);
    }
    close() {
      this.remoteConnection.close();
    }
    // Established locally
    async connect(id, timeout = 5e3) {
      if (this.isConnected) {
        this.logger.log(
          "Can not connect to",
          id,
          "(Already connected to",
          this.remoteId,
          ")"
        );
        return Promise.reject();
      }
      const remoteConnection = this.peer.connect(_NetworkConnection.idPrefix + id, {
        metadata: {
          id: this.id
        }
      });
      this.logger.log(
        "Establishing connection with",
        id,
        "... (Initiated locally)"
      );
      return new Promise((res, rej) => {
        setTimeout(() => {
          if (this.isConnected)
            return;
          remoteConnection.close();
          rej("timeout");
        }, timeout);
        remoteConnection.on("open", () => {
          const tempStartTime = Date.now();
          remoteConnection.once("data", ({
            event,
            data
          }) => {
            if (event === 0 /* ACCEPT_CONNECTION */) {
              this.logger.log("Connection with", data.id, "was accepted");
              this.remoteConnection = this.dummyConnection.morphToRealConnection(
                remoteConnection
              );
              this.onConnect(tempStartTime);
              res();
            } else if (event === 1 /* DECLINE_CONNECTION */) {
              this.logger.log(
                "Connection with",
                data.id,
                "was declined, closing connection"
              );
              remoteConnection.close();
              rej();
            }
          });
        });
      });
    }
    // Established remotely
    handleIncomingConnections() {
      this.peer.on("connection", async (connection) => {
        this.logger.log(
          "Establishing connection with",
          connection.metadata.id,
          "... (Initiated remotely)"
        );
        if (!connection.open)
          await this.waitForConnectionCB(connection, "open");
        const tempStartTime = Date.now();
        if (this.isConnected) {
          this.logger.log(
            "Declining connection with",
            connection.metadata.id,
            "(Already connected)"
          );
          connection.send({
            event: 1 /* DECLINE_CONNECTION */,
            data: {
              id: this.id
            }
          });
          connection.on("close", () => {
            this.logger.log(
              "Closed connection with",
              connection.metadata.id
            );
          });
          return;
        }
        this.logger.log(
          "Accepting connection with",
          connection.metadata.id,
          "..."
        );
        connection.send({
          event: 0 /* ACCEPT_CONNECTION */,
          data: {
            id: this.id
          }
        });
        this.remoteConnection = this.dummyConnection.morphToRealConnection(connection);
        this.onConnect(tempStartTime);
      });
    }
    //#endregion
    //#region Simple Data Transfer
    on(eventName, cb) {
      const wrapper = (packet) => {
        if (eventName !== "ALL" && packet.subEvent !== eventName)
          return;
        return cb(packet.data);
      };
      this.remoteConnection.on("data", wrapper);
    }
    async send(eventName, data) {
      if (Diagnostics.artificialLag)
        await Promise.timeout(60);
      this.remoteConnection.send({
        event: 2 /* DATA */,
        subEvent: eventName,
        data
      });
    }
    //#endregion
    //#region Fetch / Response
    nextFetchId = 0;
    fetch(endpoint) {
      const transactionId = this.nextFetchId++;
      this.remoteConnection.send({
        event: 3 /* FETCH */,
        subEvent: endpoint,
        id: transactionId
      });
      return new Promise((res) => {
        const tempFn = (packet) => {
          if (packet.event !== 4 /* FETCH_RESPONSE */)
            return;
          if (packet.id !== transactionId)
            return;
          this.remoteConnection.off("data", tempFn);
          res(packet.data);
        };
        this.remoteConnection.on("data", tempFn);
      });
    }
    addResponse(endpoint, respond) {
      this.remoteConnection.on("data", async (packet) => {
        if (packet.event !== 3 /* FETCH */ || packet.subEvent !== endpoint)
          return;
        const data = await respond();
        this.remoteConnection.send({
          event: 4 /* FETCH_RESPONSE */,
          id: packet.id,
          data
        });
      });
    }
    //#region Utils
    waitForConnectionCB(connection, ev) {
      return new Promise((res) => {
        connection.once(ev, (...args) => res());
      });
    }
    update() {
      if (this.framesConnected !== null) {
        this.framesConnected++;
      }
    }
  };
  var NetworkConnection = _NetworkConnection;
  __publicField(NetworkConnection, "idPrefix", "drivegame-beta-");
  // "drivegame-prod-"
  __publicField(NetworkConnection, "idLength", 1);
  var DummyDataConnection = class {
    cbs = [];
    on(ev, cb) {
      if (ev !== "data")
        console.warn(
          "Dummy listener captured unexpected event",
          ev,
          '(Only "data" event is expected with a dummy)'
        );
      this.cbs.push(cb);
    }
    send(...args) {
      console.warn(
        "Send was called with a dummy data connection. Data can not be sent without an actual data connection and remote peer. Make sure client is connected before sending data"
      );
    }
    close() {
    }
    // Used for when a client connects
    morphToRealConnection(connection) {
      this.cbs.forEach((cb) => connection.on("data", cb));
      return connection;
    }
    // Used for when a client disconnects
    fromDataConnection(connection) {
      this.cbs.length = 0;
      this.cbs.push(...connection.listeners("data"));
      return this;
    }
  };
  var networkConnectionPlugin = ResourceUpdaterPlugin(
    NetworkConnection,
    true
  );

  // src/test.ts
  var nc = window.nc = new NetworkConnection(null);
  Promise.resolve().then(() => {
    nc.on("ping", ([frame, time]) => {
      document.body.innerHTML = `Lag: ${nc.framesConnected - frame}frames, ${Date.now() - (nc.connectionStartTime + time)}ms`;
    });
    nc.waitForConnection.then(() => {
      setInterval(() => {
        nc.update();
        nc.send("ping", [
          nc.framesConnected,
          Date.now() - nc.connectionStartTime
        ]);
        console.log("updating");
      }, 1e3 / 60);
    });
  });
})();
/*! Bundled license information:

tweakpane/dist/tweakpane.js:
  (*! Tweakpane 4.0.1 (c) 2016 cocopon, licensed under the MIT license. *)
*/
//# sourceMappingURL=test.js.map
